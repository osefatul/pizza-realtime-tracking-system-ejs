require("dotenv").config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressJsLayout = require('express-ejs-layouts');
const path = require('path');
const mongoDB = require("mongoose")
const apiRoutes = require("./routes/api")
const session = require("express-session")
const flash = require("express-flash")
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
const Emitter = require('events')



//Mongo Configs
mongoDB.set('strictQuery', true)
mongoDB.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to MongoDB")
})
mongoDB.connection.on('error', console.error.bind(console, 'connection error:'));



// Session store
let mongoStore = new MongoDbStore({
    mongooseConnection: mongoDB.connection,
    collection: 'sessions'
})


// Event emitter
const eventEmitter = new Emitter()
//emitter is bind in app, so we can access it anywhere, but in our case we will be using it in statusController to receiving events
app.set('eventEmitter', eventEmitter)


// Session config
app.use(session({
secret: process.env.COOKIE_SECRET,
resave: false,
store: mongoStore,
saveUninitialized: false,
cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))


//passport config
const passportInit = require("./app/config/passport")
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());


//Assets location:
//Otherwise we will get
//"Refused to execute script from 'http://localhost:5000/js/app.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled." error.
app.use(express.static('public'))
//when body is receiving data..
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(flash())



//GLOBAL MIDDLEWARE FOR SETTING SESSION & USER IN FRONTEND
app.use((req, res, next)=>{
    res.locals.session = req.session; 
    res.locals.user = req.user;// from passport.js
    
    next();
})


//SET TEMPLATE ENGINE..
app.use(expressJsLayout);
app.set("views", path.join(__dirname,"/resources/views")) // to find views
app.set("view engine", "ejs")


apiRoutes(app)
//All the <%- body %> goes here below...
//This should always come after setting view engine
const routes = require("./routes/web");
routes(app)



PORT = process.env.PORT || 5000;
const server= app.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})



//SETTING WEB_SOCKET SERVER
const io = require("socket.io")(server)

/// Socket
io.on("connection", socket => {
    console.log("Socket connected => ", socket.id) //my socket.id

      //Join room as a customer(roomId will be orderId)or admin(roomId will be adminRoom)
    socket.on('join', (orderId) => {
        console.log(orderId)
        socket.join(orderId)
    })
})


//as the eventEmitter is emitted in statusController, we get it here as we listen to it.
eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})


//event for admin page to be updated with new orders in realtime
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit("orderPlaced", data)
})