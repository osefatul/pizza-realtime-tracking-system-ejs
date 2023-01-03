import Noty from "noty";
import { initAdmin } from "./admin";
import { updateStatus } from "./updateStatus";
import moment from "moment";


import { removeItemFromCart } from "./shoppingCartFunctionalities/removeItemFromCart";
import { decrementProduct } from "./shoppingCartFunctionalities/decrementProduct";
import { incrementProduct } from "./shoppingCartFunctionalities/incrementProduct";
import { addToCart } from "./shoppingCartFunctionalities/addToCart";
import { initStripe } from "./stripeFunctionalities/stripe";





//sidebar functionalities -----
const toggleButton = document.querySelector(".toggleButton");
const sidebar = document.querySelector(".sidebar");
const closeButton = document.querySelector(".closeButton");

toggleButton.onclick = ()=>{
    sidebar.classList.add("showSidebar")
}

closeButton.onclick = ()=>{
    sidebar.classList.remove("showSidebar")
}
// --End Sidebar functionalities -----



// Shopping Cart Functionalities
addToCart()
incrementProduct()
decrementProduct()
removeItemFromCart()

initAdmin();
initStripe()



//Remove flash alert message after x seconds in the orders page
const alertMsg = document.querySelector("#success-alert")
// if id exists
if(alertMsg){
    setTimeout(()=> {
        alertMsg.remove();
    },2000)
}



let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput? hiddenInput.value: null
order = JSON.parse(order)

//ORDER STATUS FUNCTIONALITIES..
updateStatus(order)




// SOCKET FUNCTIONALITY ---
//already imported socket.io library in layout.ejs.lets call it here
const socket = io();

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


//Add a socket in the /admin/orders page so that it works in realtime when an order is placed
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}





