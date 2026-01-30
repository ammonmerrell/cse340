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
  const grid = await utilities.buildIdGrid(data)
  let nav = await utilities.getNav()
  const carYear = data[0].inv_year
  const carMake = data[0].inv_make
  const  carModel = data[0].inv_model
  const carPrice = data[0].inv_price
  res.render("./inventory/details.ejs", {
    title: carYear + " " + carMake + "  " + carModel+ "  $" +carPrice,
    nav,
    grid,
  })
}

invCont.buildInventoryManager = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management.ejs", {
    title: "Inventory Manager",
    nav,
  })
}

  module.exports = invCont