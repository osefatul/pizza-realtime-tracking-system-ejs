const { Order } = require("../../../../models/orderSchema")


const statusController = () => {

    return {
        async update (req, res, next) {
            await Order.findByIdAndUpdate({_id:req.body.orderId},
                {status:req.body.status}, {new: true}
            ).then(response => {
                console.log(res)
                // we need to get same instance of the emitter we set in app.
                const eventEmitter = req.app.get("eventEmitter");

                //these two new data have been sent by client, and we will send them back but through emitter and socket.
                eventEmitter.emit(
                    "orderUpdated", 
                    {id:req.body.orderId, 
                    status:req.body.status}
                )

                //if we don't send response the page will keep waiting for response and don nothing..
                res.redirect("/admin/orders")
            }).catch(err => {
                console.log(err)
                res.redirect("/admin/orders")            
            })
            
        }
    }
}


module.exports = statusController