


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

        console.log("Hello from stripe")
        console.log(formData)

        for(let [key, value] of formData.entries()) {
            console.log(key, value)
        }
        // if(!card){
        //     placeOrder(formObject)
        // }

    })

        }


}