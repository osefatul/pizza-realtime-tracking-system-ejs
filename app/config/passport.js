const LocalStrategy = require("passport-local").Strategy
const {User} = require("../models/userSchema")
const bcrypt = require("bcrypt")


const init = (passport)=>{

    passport.use(new LocalStrategy(
        { usernameField: 'email' }, 
        async (email, password, done) => {

        // Login
        // check if email exists
        const user = await User.findOne({ email: email })
        if(!user) {
            return done(null, false, { message: 'No user with this email' })
        }

        bcrypt.compare(password, user.password).then(match => {
            if(match) {
                return done(null, user, { message: 'Logged in successfully' })
            }

            return done(null, false, { message: 'Wrong username or password' })
        }).catch(err => {
            return done(null, false, { message: 'Something went wrong' })
        })
    }))

    //Store data in session after login
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    //get data from session when login is successful..
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}

module.exports = init