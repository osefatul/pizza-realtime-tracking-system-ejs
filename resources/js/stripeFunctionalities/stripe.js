
import { loadStripe } from '@stripe/stripe-js'
import { CardWidget } from "./CardWidget";
import { placeOrder } from "./apiService";


export async function initStripe() {

    const stripe = await loadStripe('pk_test_51Lk5fxJXwXjcmUVPC4DvlU9FnpFuao2YlLuMhPuEULHtOk8tVrLYhoGdZHYF8Vczc0rse6UeOzb8USJ2qoaQFGH100818JkF64');
    let card = null;


    const paymentType = document.querySelector('#paymentType');
    if(!paymentType) {
        return;
    }
    paymentType.addEventListener('change' , (e)=> {

        if(e.target.value === 'card') {
            // Display Widget
            card = new CardWidget(stripe)
            card.mount()
        } else {
            card.destroy()
        }

    })


    // Ajax call
    const paymentForm = document.querySelector('#payment-form');
    if(paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {

            //This will prevent the form to be submitted from cart.ejs action and method attributes, so we can perform below stuff.
            e.preventDefault();


            let formData =  new FormData(paymentForm);
            let formObject = {};

            for(let [key, value] of formData.entries()) {
                // console.log(key, value)
                formObject[key] = value;
            }

            if(!card){
                placeOrder(formObject)
            }

            const token = await card.createToken()
            formObject.stripeToken = token.id;
            placeOrder(formObject);
        })
    }


}