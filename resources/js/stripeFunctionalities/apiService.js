import axios from 'axios'
import Noty from 'noty'


export const placeOrder = (formObject) => {
    axios.post("/orders", formObject)
    .then((response) => {

        new Noty({
            type: 'success',
            timeout: 1000,
            text: response.data.message,
            progressBar: false,
        }).show();
        setTimeout(() => {
            window.location.href = '/customer/orders';
        }, 1000);
        
    }).catch((err)=> {
        new Noty({
            type: 'success',
            timeout: 1000,
            text: err.res.data.message,
            progressBar: false,
        }).show();
    })
}