const {Order} = require("../../../models/orderSchema")

const orderController = ()=>{



    return {
        async store(req, res){
            //validate order
            const {phone, address, paymentType} = req.body;
            console.log(req.body)

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
                

            }catch(err){
                console.log(err)
            }
        }
    }
}


module.exports = orderController;