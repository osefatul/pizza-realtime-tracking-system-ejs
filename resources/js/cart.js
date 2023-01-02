import axios from "axios";
import Noty from "noty";






const cart = ()=>{



    const updateCart = async (pizza)=>{
        try{
            const res = await axios.post("/update-cart", pizza);
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

    let cart = [];
    let cartMarkup;
    const pizzaList = document.querySelector(".pizza-list");

    axios.get("/cart", {
        headers: {
            "X-Requested-With":"XMLHttpRequest"
        }
    }).then((response) => {

        cart = response.data.cart.items
        cartMarkup = generateMarkup(cart);
        pizzaList.innerHTML = cartMarkup;

    }).catch((error) =>{
        console.log(error);
    });


    function decrementQty(i) {
        if(cart[i].qty === 1) return
        let getItem = document.querySelectorAll("#quantity__input")[i];
        cart[i].qty--;
        getItem.value = cart[i].qty;
        updatePrice(cart)
    }
    
    async function incrementQty(pizza) {
        console.log(pizza);
        // const res =  await updateCart(pizza.item);
        // updatePrice(cart)
    }


    
    const generateMarkup = (cart) =>{
        return Object.values(cart).map(pizza =>{
            console.log(pizza)

            return `
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
                        <a href="#" onclick="incrementQty(${pizza})">
                            <i class="las la-plus text-green-500 hover:text-green-400"></i>
                        </a>
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
    }
}



export default cart