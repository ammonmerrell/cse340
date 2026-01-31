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
        .escape()
        .notEmpty()
        .isLength({min: 1 })
        .withMessage("Please provide a classification name."),
    ]
}


/* *****
* Check data and return errors on continue to add classification
* ***** */
validate.checkRegData = async (req, res, next) => {
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
        })
        return
    }
    next()
}
module.exports = validate