const { Order } = require("../../../../models/orderSchema");



const adminOrderController = () =>{

return {
        index(req, res) {
        //status !== completed
        Order.find({ status: { $ne: 'completed' } }, 
        null, 
        { sort: { 'createdAt': -1 }})
        .populate('customerId', '-password')
        .exec((err, orders) => {
            //if request is XMLHttpRequest
            if(req.xhr) {
                return res.json(orders)
            } else {
                // if somebody goes directly to below link
                return res.render('admin/orders')
            }
            })
        }
    }
}


module.exports = adminOrderController;