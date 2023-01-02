import axios from "axios"
import Noty from "noty";
import { initAdmin } from "./admin";
import { updateStatus } from "./updateStatus";
import moment from "moment";
import cart from "./cart";
import { removeItemFromCart } from "./removeItemFromCart";
import { decrementProduct } from "./decrementProduct";



// array of btns
const addTOCarts = document.querySelectorAll(".add-to-cart") 
const cartCounter = document.querySelector("#cartCounter");





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





const updateCart = async (pizza)=>{
    try{
        const res = await axios.post("/update-cart", pizza);
        // console.log(res.data)
        cartCounter.innerText = res.data.totalQty

        //we return the value so we can use it for cart items on cart page.
        
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false,
        }).show();

        return res.data;
        
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








//Add cart buttons in HOME page
addTOCarts.forEach((btn)=>{
    btn.addEventListener("click", (e)=>{
        // console.log(e)
        const pizza = JSON.parse(btn.dataset.pizza)
        console.log(btn.parentElement.parentElement)
        updateCart(pizza);


    })
})


removeItemFromCart()

// cart()






const incrementProduct = async (pizza)=>{
    try{
        const res = await axios.post("/increment-cart", pizza);
        // console.log(res.data)
        cartCounter.innerText = res.data.totalQty

        //we return the value so we can use it for cart items on cart page.
        
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false,
        }).show();

        return res.data;
        
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




decrementProduct()


// add pizza on cart page
const addPizza = document.querySelectorAll(".add-pizza");
const totalPrice = document.querySelector(".totalPrice");

addPizza.forEach((btn)=>{
    btn.addEventListener("click", async (e)=>{
        const pizza = JSON.parse(btn.dataset.pizza)
        // console.log(pizza.item)
        const res =  await incrementProduct(pizza);
        // console.log(res)
        
        //update the amount of products..
        btn.parentElement.children[1].children[0].innerText= "";
        btn.parentElement.children[1].children[0].innerText = res.itemQty;
        

        //update the price of the products
        btn.parentElement.nextElementSibling.children[0].innerText= "";
        btn.parentElement.nextElementSibling.children[0].innerText = res.itemQty * +res.item.price

        //update totalPrice as well
        totalPrice.innerText = "";
        totalPrice.innerText = `$ ${res.totalPrice}`

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





