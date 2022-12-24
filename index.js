require("dotenv").config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressJsLayout = require('express-ejs-layouts');
const path = require('path');
const mongoDB = require("mongoose")
const apiRoutes = require("./routes/api")

const session = require("express-session")
const flash = require("flash")
const MongoDbStore = require('connect-mongo')(session)





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
// const eventEmitter = new Emitter()
// app.set('eventEmitter', eventEmitter)

// Session config
app.use(session({
secret: process.env.COOKIE_SECRET,
resave: false,
store: mongoStore,
saveUninitialized: false,
cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))

app.use(flash())


//Assets location:
//Otherwise we will get
//"Refused to execute script from 'http://localhost:5000/js/app.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled." error.
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


//GLOBAL MIDDLEWARE FOR SETTING SESSION IN FRONTEND
app.use((req, res, next)=>{
    res.locals.session = req.session;
    next();
})


apiRoutes(app)

//SET TEMPLATE ENGINE..
app.use(expressJsLayout);
app.set("views", path.join(__dirname,"/resources/views")) // to find views
app.set("view engine", "ejs")


//All the <%- body %> goes here below...
//This should always come after setting view engine
const routes = require("./routes/web");
const webRoutes = routes(app)








PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})