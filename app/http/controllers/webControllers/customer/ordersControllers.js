const {Order} = require("../../../../models/orderSchema")
const moment = require("moment");


const orderController = ()=>{



    return {
        async store(req, res){
            //validate order
            const {phone, address, paymentType} = req.body;
            // console.log(req.body)
            if(!phone || !address){
                return res.status(422).json({message:"All fields are required"})
            }

            try{
                const order = new Order ({
                    customerId: req.user._id, //from passport.js
                    items: req.session.cart.items, // from express-session
                    phone, 
                    address
                })
                await order.save()
                req.flash("success", "Order added successfully");
                delete req.session.cart
                res.redirect("/customer/orders")
            }catch(err){
                console.log(err)
            }
        },

        async index(req, res) {
            const orders = await Order.find(
                { customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } } )
            // we don't want any cache when we go back to previous page..
            // because we were receiving messageAlert if we return back to the page.
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
    }
}


module.exports = orderController;