import axios from "axios"
import Noty from "noty";


const decrementProductApi = async (pizza)=>{
    try{
        const res = await axios.post("/decrement-cart", pizza);
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




export const decrementProduct = ()=>{

    const subtractPizzas = document.querySelectorAll(".subtract-pizza");
    const totalPrice = document.querySelector(".totalPrice");

    subtractPizzas.forEach(btn =>{
        btn.addEventListener("click", async(e)=> {

            const pizza = JSON.parse(btn.dataset.pizza)
            const res =  await decrementProductApi(pizza);

            btn.nextElementSibling.children[0].innerText ="";
            btn.nextElementSibling.children[0].innerText = res.itemQty;

            btn.parentElement.nextElementSibling.children[0].innerText = "";
            btn.parentElement.nextElementSibling.children[0].innerText = res.itemQty * +res.item.price

            
            //update totalPrice as well
            totalPrice.innerText = "";
            totalPrice.innerText = `$ ${res.totalPrice}`
        })
    })

}