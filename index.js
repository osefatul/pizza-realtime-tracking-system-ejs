require("dotenv").config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressJsLayout = require('express-ejs-layouts');
const path = require('path');



PORT = process.env.PORT || 5000;

//test run
app.get("/", (req, res) => {
    res.send("Hi there!");
})


//SET TEMPLATE ENGINE..
app.use(expressJsLayout);
app.set("views", path.join(__dirname,"resources/views")) // to find views
app.set("view engine")

app.listen(PORT, ()=>{
    console.log('listening on port', PORT)
})