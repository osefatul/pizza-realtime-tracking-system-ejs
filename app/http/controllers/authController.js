const {User} = require("../../models/userSchema")
const bcrypt = require("bcrypt");

const authController = ()=>{

    return {
        async login (req, res) {
            res.render("auth/login")
        },

        async register (req, res) {
            res.render("auth/register")
        },

        async postRegister (req, res) {
            const {name, email, password} = req.body
            
            if(!name || !email || !password) {
                req.flash('error', 'All fields are required')

                //if there is an error and we send error to register page. bt we don't want to erase data that were entered, even after error.
                req.flash("name", name);
                req.flash("email", email);
                res.redirect("/register")
            }

            //check if user already registered
            const user = await User.findOne({email:email});
            if(user){
                req.flash("error", 'User already registered')
                req.flash("name", name);
                req.flash("email", email);
                return res.redirect("/register")
            }

            //create a user:
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name, 
                email, 
                password:hashedPassword
            })

            newUser.save().then(user => {
                //login
                return res.redirect("/")
            }).catch( err  => {
                req.flash("error", "Something went wrong")
                return res.redirect("/register")
            })
        },

        login (req, res) {
        }
    }
}


module.exports = authController