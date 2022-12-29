import axios from "axios"
import Noty from "noty";
import { initAdmin } from "./admin";
import { updateStatus } from "./updateStatus";


// array of btns
const addTOCarts = document.querySelectorAll(".add-to-cart") 
const cartCounter = document.querySelector("#cartCounter");


const updateCart = async (pizza)=>{
    try{
        const res = await axios.post("/update-cart", pizza);
        cartCounter.innerText = res.data.totalQty

        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false,
        }).show();

    }catch(err){
        console.log(err)
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
        }).show();
    }
}


//Add cart buttons
addTOCarts.forEach((btn)=>{
    btn.addEventListener("click", (e)=>{
        // console.log(e)
        const pizza = JSON.parse(btn.dataset.pizza)
        // console.log(pizza)
        updateCart(pizza);
    })
})


//remove flash alert message after x seconds
const alertMsg = document.querySelector("#success-alert")
// if id exists
if(alertMsg){
    setTimeout(()=> {
        alertMsg.remove();
    },2000)
}


//call initAdmin
initAdmin();

let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput? hiddenInput.value: null
order = JSON.parse(order)

//Updating order status
updateStatus(order)



//As we already imported our socket.io library in layout.ejs.lets call it here
// Socket
const socket = io();

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}



socket.on("orderUpdated", (data) => {
    const updatedOrder = {...order};
    
})