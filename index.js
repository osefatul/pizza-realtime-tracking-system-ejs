require("dotenv").config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressJsLayout = require('express-ejs-layouts');
const path = require('path');
const mongoDB = require("mongoose")
const apiRoutes = require("./routes/api")
PORT = process.env.PORT || 5000;


//Assets location:
//Otherwise we will get
//"Refused to execute script from 'http://localhost:5000/js/app.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled." error.
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



apiRoutes(app)


//SET TEMPLATE ENGINE..
app.use(expressJsLayout);
app.set("views", path.join(__dirname,"/resources/views")) // to find views
app.set("view engine", "ejs")


// All the <%- body %> goes here below...
//This should always come after setting view engine
const routes = require("./routes/web");
const webRoutes = routes(app)



mongoDB.set('strictQuery', true)
mongoDB.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to MongoDB")
})
mongoDB.connection.on('error', console.error.bind(console, 'connection error:'));


app.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})