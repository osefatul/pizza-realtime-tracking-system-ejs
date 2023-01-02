import axios from "axios"
import Noty from "noty";



const deleteItem = async (pizza)=>{
    try{
        const res = await axios.post("/remove-cart", pizza);
        console.log(res.data);
        cartCounter.innerText = res.data.totalQty

        //we return the value so we can use it for cart items on cart page.
        
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item deleted from cart',
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






export const deleteCart = () =>{
    const deleteBtn = document.querySelectorAll(".deleteBtn");

    //Delete Cart item
    deleteBtn.forEach(btn =>{
        btn.addEventListener("click", (e) =>{
            
            const pizza = JSON.parse(btn.dataset.pizza)
            // console.log(pizza)
            var buttonClicked = e.target;
            // buttonClicked.parentElement.remove(); //both are same
            btn.parentElement.remove();
            deleteItem(pizza)
        })
    })

}