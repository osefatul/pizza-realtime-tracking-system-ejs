const homeController = require("../app/http/controllers/homeController")
const authController = require("../app/http/controllers/authController");
const customerController = require("../app/http/controllers/customer/customerController");




const initRoute = (app)=>{

    //test home page
    // app.get("/", (req, res) => {
    //     res.render("home");// views/render home.ejs 
    // })

    // Just as reminder: In JavaScript, the difference between the two expressions homeController().index and homeController.index() is that the first one is accessing a property of the object returned by the homeController function, while the second one is calling the index function that is a property of the homeController object.

    app.get("/", homeController().index)
    app.get("/login", authController().login);
    app.get("/register", authController().register);
    app.get("/cart", customerController().cart)
}





module.exports = initRoute