const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema ({
    email: {type:String, required:true},
    name: {type:String, required:true},
    password: {type:String, required:true},
    role:{type:String, default: 'customer'}
},
{timestamps:true})

module.exports = {
    User: mongoose.model("User", userSchema)
}
