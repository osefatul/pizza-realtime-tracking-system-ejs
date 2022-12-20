require("dotenv").config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressJsLayout = require('express-ejs-layouts');
const path = require('path');



PORT = process.env.PORT || 5000;

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



//test run
app.get("/", (req, res) => {
    res.render("home");// views/render home.ejs 
})


//SET TEMPLATE ENGINE..
app.use(expressJsLayout);
app.set("views", path.join(__dirname,"/resources/views")) // to find views
app.set("view engine", "ejs")









app.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})