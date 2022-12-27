import axios from "axios"
import Noty from "noty";

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
const alertMsg = document.querySelector("#success-alert")// if id exists
if(alertMsg){
    setTimeout(()=> {
        alertMsg.remove();
    },2000)
}