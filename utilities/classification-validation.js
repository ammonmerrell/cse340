const util = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}
  
/* *****
* classification Name data validation rules
* ***** */
validate.classnameRules = () => {
    return [
        //name has no spaces
        body("classification_name")
          .trim()
          .isLength({ min: 1 })
          .isAlpha()
          .withMessage("Please provide a classification name."),
    ]
}

validate.loginRules = () => {
    return [
        body("account_email")
                    .trim()
                    .escape()
                    .notEmpty()
                    .isEmail()
                    .normalizeEmail() //refer to validator.js docs
                    .withMessage("A valid email is required.")
                    .custom(async (account_email) => {
                      const emailExists = await accountModel.checkExistingEmail(account_email)
                      if (emailExists){
                        
                      }else {
                        throw new Error("Email dosen't exist. Please log in using correct email")
                      }
                    }),
    ]
}
/* *****
* Check data and return errors on continue to add classification
* ***** */
validate.checkRegData = async (req, res, next) => {
  let links = await util.buildInvManager()
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await util.getNav()
        res.render("inventory/management", {
            errors,
            title: "Inventory Management",
            nav,
            classification_name,
            links,
        })
        return
    }
    next()
}

validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await util.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
    })
    return
  }
  next()
}

module.exports = validate