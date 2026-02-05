// Needed resources
const express = require("express")
const router = new express.Router()
const util = require("../utilities/index")
const accController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/login", util.handleErrors(accController.buildLogin));
router.get("/register", util.handleErrors(accController.registerUser));
router.get("/", util.handleErrors(accController.registerAccount));
// router.get("/", util.checkLogin, util.handleErrors(accController.registerAccount));
// process the data
router.post(
  "/register", 
  regValidate.registrationRules(),
  regValidate.checkRegData,
  util.handleErrors(accController.registerAccount)
)
// process the  login attempt

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  util.handleErrors(accController.accountLogin)
)

// router.post(
//   "/login",
//   util.handleErrors(accController.buildAccReg)
// )

module.exports = router;