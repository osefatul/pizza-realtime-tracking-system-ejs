import moment from "moment";


export const updateStatus = (order)=>{

    let statuses = document.querySelectorAll('.status_line')
    let time = document.createElement("small")

    console.log(order)

    //First loop through all order and remove below classes.
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    //Check steps again and update with db status value.
    //for the status that stepCompleted is true make them gray.
    //for the not completed leave them as it is
    let stepCompleted = true;
    statuses.forEach((status)=>{

        if(stepCompleted) {
            status.classList.add('step-completed')
        }
        
        let dataProp = status.dataset.status;
        if(dataProp === order.status){
            stepCompleted = false;//for the next step in the loop it will not be added
            time.innerText = moment(order.updatedAt).format("hh:mm A")
            status.append(time)

            if(status.nextElementSibling){
                status.nextElementSibling.classList.add("current")
            }
        }
    })
}