const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* *****
* Build inventory by classification view
* ***** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
//I used the buildByClassificationId function to make buildByInd_id function.
// the classification function variable will act as the inv_id in the getInfoByClassificationId function.
invCont.buildByInv_id = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInfoByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + "  Type",
    nav,
    grid,
  })
}

  module.exports = invCont