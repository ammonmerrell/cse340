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

/* *****
* inventory name data validation rules
***** */
validate.inventoryRules = () => {
    return [
        //name has no spaces
        body("classification_id")
          .trim()
          .isInt({
            no_symbols: true,
          })
          .withMessage("The vehicle's classification is required."),

        body("inv_make")
          .trim()
          .isLength({ min: 1 })
          .isAlpha()
          .withMessage("Please provide a classification name."),

        body("inv_model")
          .trim()
          .escape()
          .isLength({ min: 3, })
          .withMessage("A vehicle model is required."),

        body("inv_description")
          .trim()
          .escape()
          .isLength({ min: 3, })
          .withMessage("A vehicle description is required."),

        body("inv_image")
          .trim()
          .isLength({
            min: 6,
          })
          .matches(/\.(jpg|jpeg|png|webp)$/)
          .withMessage("A vehicle image path is required and must be an image"),

        body("inv_thumbnail")
          .trim()
          .isLength({ min: 6, })
          .matches(/\.(jpg|jpeg|png|webp)$/)
          .withMessage("A vehicle image path is required and must be an image."),
        
        body("inv_price")
          .trim()
          .isDecimal()
          .withMessage("A vehicle price is required."),

        body("inv_year")
          .trim()
          .isInt({
            min: 1900,
            max: 2099,
          })
          .withMessage("A vehicle year is required."),

        body("inv_miles")
          .trim()
          .isInt({
              no_symbols: true,
          })
          .withMessage("The vehicle's miles are required."),

        body("inv_color")
          .trim()
          .escape()
          .isLength({
            min: 3,
          })
          .withMessage("The vehicle's color is required.")
    ]
}
/* *****
* update inventory name data validation rules
***** */
validate.inventoryNewRules = () => {
    return [
        //name has no spaces
        body("inv_make")
          .trim()
          .isLength({ min: 1 })
          .isAlpha()
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
        let links = await util.buildInvManager()
        res.render("inventory/add-classification", {
            errors,
            title: "Classification Form",
            nav,
            // classification_name,
            links,
        })
        return
    }
    next()
}
/* *****
* Inventory and show results
* *****/
validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_desc, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await util.getNav()         
        // let links = await util.buildInvManager()
        res.render("inventory/add-classification", {
            errors,
            title: "Inventory Management",
            nav,
            inv_model,
            inv_make,
            inv_year,
            inv_desc,
            inv_price,
            inv_miles,
            inv_color,
            // classification_name,
            // links,
        })
        return
    }
    next()
}

/* *****
* Edit Inventory and show results
* *****/
validate.checkEditData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_desc, inv_price, inv_miles, inv_color, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await util.getNav()         
        // let links = await util.buildInvManager()
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit: "+ inv_make +" "+inv_model,
            nav,
            inv_model,
            inv_make,
            inv_year,
            inv_desc,
            inv_price,
            inv_miles,
            inv_color,
            inv_id,
            // classification_name,
            // links,
        })
        return
    }
    next()
}
module.exports = validate