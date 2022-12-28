const { Order } = require("../../../../models/orderSchema")


const statusController = () => {

    return {
        async update (req, res, next) {
            await Order.findByIdAndUpdate({_id:req.body.orderId},
                {status:req.body.status}, {new: true}
            ).then(response => {
                // console.log(res)
                res.redirect("/admin/orders")
            }).catch(err => {
                console.log(err)
                res.redirect("/admin/orders")            
            })
            
        }
    }
}


module.exports = statusController