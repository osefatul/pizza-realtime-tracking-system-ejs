const {Order} = require("../../../../models/orderSchema")
const moment = require("moment");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)






const orderController = ()=>{

    return {
        async store(req, res){
            
            //validate order
            const { phone, address, stripeToken, paymentType } = req.body
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

                await order.save().then(result => {

                    Order.populate(result, 
                    { path: 'customerId' }, 
                    (err, placedOrder) => {
                        // req.flash("success", "Order added successfully");
                        // res.redirect("/customer/orders")

                        if(paymentType === "card"){
                            stripe.charges.create({
                                amount:req.session.cart.totalPrice * 100,
                                source:stripeToken,
                                currency: "usd",
                                description:`Pizza order: ${placedOrder._id}`
                            }).then(()=>{
                                placedOrder.paymentStatus = true
                                placedOrder.paymentType = paymentType
                                placedOrder.save().then(ord =>{

                                //Emit event for placing order
                                const eventEmitter = req.app.get("eventEmitter");
                                eventEmitter.emit("orderPlaced", ord)
                                delete req.session.cart

                                return res.json({ message : 'Payment successful, Order placed successfully' });

                                
                                })
                            }).catch(e => console.log(e))
                        
                        }else {
                            delete req.session.cart
                            return res.json({ message : 'Order placed successfully' });
                        }
                    })

                }).catch((err)=>{
                    console.log(err)
                    return res.status(500).json({ message : 'Something went wrong' });
                    // return res.redirect("/cart")
                })

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

        async show(req, res) {
            const order = await Order.findById(req.params.id);
            //Authorize user
            if(req.user._id.toString() === order.customerId.toString()){
                return res.render("customers/singleOrder", {order})
            }
            return res.redirect("/")
        }
    }
}


module.exports = orderController;