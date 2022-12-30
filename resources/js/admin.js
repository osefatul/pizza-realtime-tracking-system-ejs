import axios from "axios";
import moment from "moment";
import Noty from "noty";



/* 
headers: {"X-Requested-With":"XMLHttpRequest"} explained:

The purpose of the "X-Requested-With" header is to indicate that the request is being made using the XMLHttpRequest object, which is a JavaScript object that allows web pages to perform HTTP requests asynchronously. This header is often used to signal to the server that the request is an AJAX (Asynchronous JavaScript and XML) request, as opposed to a standard HTTP request.
In this case, it is likely that the server will use the presence of this header to determine whether or not to process the request as an AJAX request, and to return the appropriate response accordingly.

further details: https://www.w3schools.com/xml/xml_http.asp
*/




export const initAdmin = (socket) =>{

    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = [];
    let markup;

    axios.get("/admin/orders", {
        headers: {
            "X-Requested-With":"XMLHttpRequest"
        }
    }).then((response) => {
        // console.log(response)
        orders = response.data;
        markup = generateMarkup(orders);
        orderTableBody.innerHTML = markup;
    }).catch((error) =>{
        console.log(error);
    });



    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
            `
        }).join('')
    }



    const generateMarkup = (orders) =>{
        return orders.map((order) => {
            return `
                <tr class="">
                <td class="border px-4 py-2 text-[#fe5f1e]">
                    <p>${ order._id }</p>
                    <div>${ renderItems(order.items) }</div>
                </td>
                <td class="border px-4 py-2">${ order.customerId.name }</td>
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${order._id}">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-[#303030] border border-gray-400 hover:bg-[#303030] hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">

                                <option 
                                class="bg-[#303030] hover:bg-[#303030]" value="order_placed"
                                    ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option 
                                class=" bg-[#303030] hover:bg-[#303030]" value="confirmed" 
                                    ${ order.status === 'confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option class=" bg-[#303030] hover:bg-[#303030]" 
                                value="prepared" 
                                    ${ order.status === 'prepared' ? 'selected' : '' }>
                                    Prepared</option>
                                <option class=" bg-[#303030] hover:bg-[#303030]"
                                value="delivered" 
                                    ${ order.status === 'delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option class=" bg-[#303030] hover:bg-[#303030]" 
                                value="completed" 
                                    ${ order.status === 'completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
                <td class="border px-4 py-2">
                    ${ order.paymentStatus ? 'paid' : 'Not paid' }
                </td>
            </tr>
            `
        }).join("")
    }

    //Socket

    socket?.on("orderPlaced", order =>{
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'New order!',
            progressBar: false,
        }).show();

        // console.log(order)
        //Don't use .push because it will add in the end of an array.
        orders.unshift(order);
        orderTableBody.innerHTML = '';//clear or delete table;
        orderTableBody.innerHTML = generateMarkup(orders);//generate another table with updated orders
    })

}
