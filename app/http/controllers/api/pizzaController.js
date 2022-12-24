const menuSchema = require("../../../models/menuSchema")


const createPizza = async (req, res)=>{
    
    try{
        const createPizza = await menuSchema.create(req.body)

        res.status(200).json(createPizza)
    }catch(err){
        console.log(err);
    }
    
}


module.exports = {
    createPizza
}