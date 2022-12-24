import axios from "axios"

const addTOCarts = document.querySelectorAll(".add-to-cart") // array


const updateCart = async (pizza)=>{
    const res = await axios.post("/update-cart", pizza);
    console.log(res)
}



addTOCarts.forEach((btn)=>{
    btn.addEventListener("click", (e)=>{
        // console.log(e)
        const pizza = JSON.parse(btn.dataset.pizza)
        // console.log(pizza)
        updateCart(pizza);
    })
})