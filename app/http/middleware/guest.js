

const guest = (req, res, next) => {
    //get this one from passport
    if(!req.isAuthenticated()) {
        return next()
    }

    return res.redirect('/')
}

module.exports = guest