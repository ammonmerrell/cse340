// Needed resources
const express = require("express")
const router = new express.Router()
const util = require("../utilities/index")
const accController = require("../controllers/accountController")
router.get("/login", util.handleErrors(accController.buildLogin));
router.get("/register", util.handleErrors(accController.registerUser));
// comment
router.post('/register', util.handleErrors(accController.registerAccount))
module.exports = router;