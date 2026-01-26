// Needed resources
const express = require("express")
const router = new express.Router()
const util = require("../utilities/index")
const accController = require("../controllers/accCountroller")
router.get("/account/login", utilities.handleErrors(accController.getAccount));
// router.get("/account/login", accController.getAccount);