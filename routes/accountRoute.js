// Needed resources
const express = require("express")
const router = new express.Router()
const util = require("../utilities/index")
const accountController = require("../controllers/accountController")
router.get("/account/login", utilities.handleErrors(accountController.getAccount));
// router.get("/account/login", accountController.getAccount);
module.exports = router;