require("dotenv").config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressJsLayout = require('express-ejs-layouts');
const path = require('path');

PORT = process.env.PORT || 5000;


//Assets location:
//Otherwise we will get
//"Refused to execute script from 'http://localhost:5000/js/app.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled." error.
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


//SET TEMPLATE ENGINE..
app.use(expressJsLayout);
app.set("views", path.join(__dirname,"/resources/views")) // to find views
app.set("view engine", "ejs")



// All the <%- body %> goes here below...
//test home page
app.get("/", (req, res) => {
    res.render("home");// views/render home.ejs 
})


// test cart page  
app.get("/cart", (req, res) => {
    res.render("customers/cart");// views/render cart.ejs
})

//login
app.get("/login", (req, res) => {
    res.render("auth/login");// views/render login.ejs
})

//register
app.get("/register", (req, res) => {
    res.render("auth/register");// views/render login.ejs
})





app.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})