const util = require("../utilities/index")

/* *****
* Deliver Login View
* ***** */
async function  buildLogin(req,res, next) {
    let nav = await util.getNav()
    res.render("account/login", {
        title: "login",
        nav,
    })    
}

/* *****
* Deliver register view
* ***** */
async function registerUser(req, res, next) {
    let nav = await util.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

module.exports = {buildLogin, registerUser}