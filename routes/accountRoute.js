// Needed resources
const express = require("express")
const router = new express.Router()
const util = require("../utilities/index")
const accController = require("../controllers/accountController")
router.get("/account/login", util.handleErrors(accController.getAccount));
// router.get("/account/login", accController.getAccount);
module.exports = router;