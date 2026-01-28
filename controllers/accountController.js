const util = require("../utilities/index")
const model = require("../models/account-model")
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

/* *****
Process Registration
* ***** */
async function registerAccount(req, res){
    let nav = await util.getNav()
    const { account_firstname, account_lastname, account_email, account_password} = req.body

    const regResult = await model.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}
module.exports = {buildLogin, registerUser, registerAccount}