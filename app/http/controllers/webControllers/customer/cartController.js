const {json, response} = require("express")

const cartController = ()=>{


    return {

        cart (req, res){
            if(req.xhr){
                res.json({cart:req.session.cart})
            }else{
                return res.render("customers/cart")
            }
        },

        updateCart (req, res) {
            // let cart = {
            // items: {
            // pizzaId: { item: pizzaObject, qty:0 },
            // pizzaId: { item: pizzaObject, qty:0 },
            // pizzaId: { item: pizzaObject, qty:0 },
            // },
            //  totalQty: 0,
            //  totalPrice: 0
            // }

            //first time creating cart and adding basic object structure...
            // if (!req.session.cart) {
            //     req.session.cart = {
            //         items: [],
            //         totalQty: 0,
            //         totalPrice: 0
            //     }
            // }
            // let cart = req.session.cart

            // // Check if item does not exist in cart 
            // if(!cart.items[req.body._id]) {
            //     cart.items[req.body._id] = {
            //         item: req.body,
            //         qty: 1
            //     }
            //     cart.totalQty = cart.totalQty + 1
            //     cart.totalPrice = +cart.totalPrice + +req.body.price
            // } else {
            //     cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
            //     cart.totalQty = cart.totalQty + 1
            //     cart.totalPrice = +cart.totalPrice + +req.body.price
            // }

            // return res.json({ 
            //     totalQty: req.session.cart.totalQty, 
            //     item: cart.items[req.body._id].qty,
            //     items: cart.items
            //     })

            if(!req.session.cart){
                req.session.cart = {
                    items: [],
                    totalQty:0 ,
                    totalPrice:0 
                }
            }

            let cart = req.session.cart;
            const existingIndex = cart.items.findIndex(item => item._id === req.body._id);

            console.log(existingIndex)

            //if item i found
            if(existingIndex >= 0){
                cart.items[existingIndex] = {
                    ...cart.items[existingIndex],
                    qty: cart.items[existingIndex].qty +1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = +cart.totalPrice + +req.body.price
            }

            //if not
            else{
                let tempProductItem = {...req.body, qty: 1}
                cart.items.push(tempProductItem);
                cart.totalQty = cart.totalQty + 1 ;
                cart.totalPrice = +cart.totalPrice + +req.body.price;
            }

            return res.json({ 
            totalQty: req.session.cart?.totalQty, 
            item: cart.items[req.body._id]?.qty,
            items: cart?.items
            })

        },

        removeCart (req, res){
            let cart = req.session.cart;

            req.session.cart.items.map((cartItem) => {
                if(cartItem._id === req.body._id){
                    const nextCartItem = cart.items.filter((item) => item._id !== cartItem._id);
                    cart.items = nextCartItem
                }
            })

            req.session.cart.totalQty = cart.totalQty - req.body.qty;
            req.session.cart.totalPrice = +cart.totalPrice - (+req.body.price * req.body.qty);

            return res.json({ 
                totalQty: req.session.cart?.totalQty, 
                item: cart.items[req.body._id]?.qty,
                items: cart?.items
            })

        }
    }
}

module.exports = cartController


