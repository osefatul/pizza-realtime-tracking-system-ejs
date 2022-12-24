
const authController = ()=>{

    return {
        async login (req, res) {
            res.render("auth/login")
        },

        async register (req, res) {
            res.render("auth/register")
        }
    }
}


module.exports = authController