// Needed resources
const express = require("express")
const router = new express.Router()
const util = require("../utilities/index")
const accController = require("../controllers/accountController")
router.get("/login", util.handleErrors(accController.buildLogin));
// router.get("/account/login", accController.buildLogin);
module.exports = router;