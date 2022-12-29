import axios from "axios"
import Noty from "noty";
import { initAdmin } from "./admin";
import { updateStatus } from "./updateStatus";
import moment from "moment";

// array of btns
const addTOCarts = document.querySelectorAll(".add-to-cart") 
const cartCounter = document.querySelector("#cartCounter");
const rightSideBurger = document.querySelector(".rightSide_burger");
const hiddenSidebar = document.querySelector(".hiddenSidebar");
const toggleButton = document.querySelector(".toggleButton");

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



rightSideBurger.onclick = ()=>{

    hiddenSidebar.classList.remove("hideSidebar")
    hiddenSidebar.classList.add("showSidebar")
}

toggleButton.onclick = ()=>{
    hiddenSidebar.classList.remove("showSidebar")
    hiddenSidebar.classList.add("hideSidebar")
}




let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput? hiddenInput.value: null
order = JSON.parse(order)


//Updating order status
updateStatus(order)


//As we already imported our socket.io library in layout.ejs.lets call it here
// Socket
const socket = io();
//call initAdmin
initAdmin();


// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}

socket.on("orderUpdated", (data) => {
    //get copy of order
    const updatedOrder = {...order};
    updatedOrder.updatedAt = moment().format() ; //update the time
    updatedOrder.status = data.status; //update order status with receiving status;
    // console.log(data)
    updateStatus(updatedOrder);

    new Noty ({
        type: "success",
        timeout: 1000,
        text: "Order updated successfully",
        progressBar: false,
    }).show()
})


//add socket in /admin/orders page as well so it also works in realtime when order is placed.
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}
