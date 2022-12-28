const homeController = require("../app/http/controllers/webControllers/homeController")
const authController = require("../app/http/controllers/webControllers/authController");
const cartController = require("../app/http/controllers/webControllers/customer/cartController");
const orderController = require("../app/http/controllers/webControllers/customer/ordersControllers");
const adminOrderController = require("../app/http/controllers/webControllers/admin/adminController");

// Middlewares 
const guest = require('../app/http/middleware/guest');
const admin = require('../app/http/middleware/admin');
const auth = require('../app/http/middleware/auth');
const statusController = require("../app/http/controllers/webControllers/admin/statusController");


const initRoute = (app)=>{

    //test home page
    // app.get("/", (req, res) => {
    //     res.render("home");// views/render home.ejs 
    // })

    // Just as reminder: In JavaScript, the difference between the two expressions homeController().index and homeController.index() is that the first one is accessing a property of the object returned by the homeController function, while the second one is calling the index function that is a property of the homeController object.

    
    //guest routes
    app.get("/login", guest, authController().login);
    app.get("/register", guest, authController().register);
    
    app.get("/", homeController().index)
    app.post("/login", authController().postLogin)
    app.post("/register", authController().postRegister);
    app.post('/logout', authController().logout)

    app.get("/cart", cartController().cart)
    app.post("/update-cart", cartController().updateCart)

    //customer routes
    app.post("/orders", auth, orderController().store)
    app.get("/customer/orders", auth, orderController().index)

    //admin routes
    app.get("/admin/orders", admin, adminOrderController().index);
    app.post("/admin/order/status", admin, statusController().update)
}





module.exports = initRoute