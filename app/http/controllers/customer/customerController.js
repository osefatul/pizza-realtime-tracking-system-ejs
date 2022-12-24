
const customerController = ()=>{
    return {
        cart (req, res){
            res.render("customers/cart")
        }
    }
}

module.exports = customerController


