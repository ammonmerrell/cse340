// Needed resources
const express = require("express")
const router = new express.Router()
const util = require("../utilities/index")
/* *****
* Deliver Content View
* ***** */
async function  buildLogin(req,res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "login",
        nav,
    })    
}

module.exports = {buildLogin}

const accController = require("../controllers/accountController")
router.get("/account/login", utilities.handleErrors(accController.getAccount));
// router.get("/account/login", accController.getAccount);
module.exports = router;