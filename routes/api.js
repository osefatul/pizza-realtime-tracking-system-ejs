const { createPizza } = require("../app/http/controllers/api/pizzaController");



const apiRoutes = (app) => {
    app.post ("/api/v1/createPizza", createPizza)
}


module.exports = apiRoutes;