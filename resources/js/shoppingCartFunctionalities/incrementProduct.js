
import axios from "axios"
import Noty from "noty";



const incrementProductApi = async (pizza)=>{
    try{
        const res = await axios.post("/increment-cart", pizza);
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


export const incrementProduct = () =>{

    // add pizza on the cart page
    const addPizza = document.querySelectorAll(".add-pizza");
    const totalPrice = document.querySelector(".totalPrice");

    addPizza.forEach((btn)=>{
        btn.addEventListener("click", async (e)=>{

            const pizza = JSON.parse(btn.dataset.pizza)
            const res =  await incrementProductApi(pizza);
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
}