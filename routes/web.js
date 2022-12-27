const homeController = require("../app/http/controllers/homeController")
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customer/cartController");

// Middlewares 
const guest = require('../app/http/middleware/guest');
const orderController = require("../app/http/controllers/customer/ordersControllers");


const initRoute = (app)=>{

    //test home page
    // app.get("/", (req, res) => {
    //     res.render("home");// views/render home.ejs 
    // })

    // Just as reminder: In JavaScript, the difference between the two expressions homeController().index and homeController.index() is that the first one is accessing a property of the object returned by the homeController function, while the second one is calling the index function that is a property of the homeController object.

    app.get("/", homeController().index)
    app.get("/login", guest, authController().login);
    app.post("/login", authController().postLogin)
    app.get("/register", guest, authController().register);
    app.post("/register", authController().postRegister);
    app.post('/logout', authController().logout)

    app.get("/cart", cartController().cart)
    app.post("/update-cart", cartController().updateCart)

    app.post("/orders", orderController().store)
    app.get("/customer/orders", orderController().index)
}





module.exports = initRoute