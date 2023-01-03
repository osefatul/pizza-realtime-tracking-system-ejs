import axios from "axios";



export async function initStripe() {


    const paymentType = document.querySelector('#paymentType');
    if(!paymentType) {
        return;
    }


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

        axios.post("/orders", formObject).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })

        // if(!card){
        //     placeOrder(formObject)
        // }

        })

        }


}