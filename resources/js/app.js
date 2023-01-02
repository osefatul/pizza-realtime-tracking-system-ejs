import axios from "axios"
import Noty from "noty";
import { initAdmin } from "./admin";
import { updateStatus } from "./updateStatus";
import moment from "moment";
import cart from "./cart";
import { deleteCart } from "./deleteCart";



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








//Add cart buttons
addTOCarts.forEach((btn)=>{
    btn.addEventListener("click", (e)=>{
        // console.log(e)
        const pizza = JSON.parse(btn.dataset.pizza)
        console.log(btn.parentElement.parentElement)
        updateCart(pizza);


    })
})




deleteCart()

// cart()

// add pizza on cart page
const addPizza = document.querySelectorAll(".add-pizza");
const pizzaCounts = document.querySelectorAll(".pizzaCounts")
const pizzaDiv = document.querySelector(".pizza-div");
const pizzaList = document.querySelector(".pizza-list");

addPizza.forEach((btn)=>{
    btn.addEventListener("click", async (e)=>{
        const pizza = JSON.parse(btn.dataset.pizza)
        // console.log(pizza.item)
        console.log(btn.parentElement)

        const res =  await updateCart(pizza.item);
        // console.log(res.items)

        pizzaList.innerHTML = "";

        Object.values(res.items).map((pizza)=>{
            pizzaList.innerHTML += `
            <div class="flex justify-between items-center py-8 w-full space-x-14 pizza-div">
                <div class="flex items-center w-2/5 mr-12 sm:mr-0">
                    <img class="h-12 sm:h-24" src="/img/${pizza.item.image}" alt="">

                    <div class="text-[12px] sm:text-md text-left ml-2 sm:ml-4">
                        <h1 class="font-bold">${pizza.item.name}</h1>
                        <span class="text-gray text-gray-400">
                            ${pizza.item.size}
                        </span>
                    </div>
                </div>

                <div class="flex items-end justify-center space-x-2 w-1/5 ml-2">
                    <span data-pizza="<%= JSON.stringify(pizza) %>" class="cursor-pointer font-bold text-lg ">
                    <i class="las la-minus-circle text-red-500 hover:text-red-400"></i>
                    </span>

                    <p class="space-x-1 pb-1 flex items-center" >
                        <span
                        data-id=${JSON.stringify(pizza.item._id)} 
                        class="pizzaCounts">
                            ${pizza.qty}
                        </span>
                        <span>Pcs</span>
                    </p>
                    <span 
                    data-pizza="<%= JSON.stringify(pizza) %>"  
                    class="cursor-pointer font-bold text-lg add-pizza">
                        <i class="las la-plus text-green-500 hover:text-green-400"></i>
                    </span>
                </div>

                <p class="flex items-center font-bold w-1/5">
                    $<span>${pizza.item.price * pizza.qty}</span>
                </p>

                <button class="deleteBtn px-1 rounded-md">
                    delete
                </button>
            </div>
            `
        }).join("")

        // console.log(pizzaList.innerHTML)

        
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





