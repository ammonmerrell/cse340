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

module.exports = {buildLogin}