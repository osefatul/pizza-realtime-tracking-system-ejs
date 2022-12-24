import axios from "axios"
import Noty from "noty";


const addTOCarts = document.querySelectorAll(".add-to-cart") // array
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



addTOCarts.forEach((btn)=>{
    btn.addEventListener("click", (e)=>{
        // console.log(e)
        const pizza = JSON.parse(btn.dataset.pizza)
        // console.log(pizza)
        updateCart(pizza);
    })
})