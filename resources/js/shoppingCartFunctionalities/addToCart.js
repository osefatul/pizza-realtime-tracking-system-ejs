import axios from "axios"
import Noty from "noty";








const addToCartApi = async (pizza)=>{
    
    try{
        const res = await axios.post("/update-cart", pizza);
        // console.log(res.data)

        const cartCounter = document.querySelector("#cartCounter");
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



export const addToCart = () => {
    // array of btns
const addTOCarts = document.querySelectorAll(".add-to-cart") 
    //Add cart buttons in HOME page
    addTOCarts.forEach((btn)=>{
        btn.addEventListener("click", (e)=>{

            const pizza = JSON.parse(btn.dataset.pizza)
            console.log(btn.parentElement.parentElement)
            addToCartApi(pizza);

        })
    })
}