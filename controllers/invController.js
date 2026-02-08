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
  const classification = await utilities.buildClassificationList()
  let links = await utilities.buildInvManager()
  res.render("inventory/management.ejs", {
    title: "Inventory Manager",
    nav,
    links,
    classification,
  })
}
invCont.buildClassificationName = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification.ejs", {
    title: "Classification Form",
    nav,
    errors: null,
  })
}

invCont.buildinventoryName = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-inventory.ejs", {
    title: "Classification Form",
    nav,
    errors: null,
  })
}


/* ****************************************
*  update inventory Name
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let links = await utilities.buildInvManager()
  const classification = await utilities.buildClassificationList()
  const { 
    inv_id,
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_price,
    inv_miles, 
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventoryItem(
    inv_id,
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_price,
    inv_miles, 
    inv_color,
    classification_id,
  )
  let nav = await utilities.getNav()

  if (updateResult) {
    const itemName = updateResult.inv_make +" "+ updateResult.inv_model;
    req.flash(
      "notice",
      `The item ${itemName} updated sucsessfully.`
    )
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, failed to update inventory item.")
    res.status(501).render("inventory/edit-inventory", {
      title: "edit " + itemName,
      nav,
      classification,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_classification_id,
    })
  }
}
/* ****************************************
*  Process classification Name
* *************************************** */
invCont.addClasificationName = async function (req, res, next) {
  let links = await utilities.buildInvManager()
  const { classification_name} = req.body

  const regResult = await invModel.addClasificationName(
    classification_name
  )
  let nav = await utilities.getNav()
  const classification = await utilities.buildClassificationList()

  if (regResult) {
    req.flash(
      "notice",
      `New classification ${classification_name} added sucsessfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Manager",
      nav,
      links,
      classification,
    })
  } else {
    req.flash("notice", "Sorry, failed to add classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Classification Form",
      nav,
      errors,
    })
  }
}

/* ****************************************
*  Process inventory Name
* *************************************** */
invCont.addInventoryName = async function (req, res, next) {
  let links = await utilities.buildInvManager()
  const classification = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color} = req.body

  const regResult = await invModel.addInventoryItem(
    inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color
  )
  let nav = await utilities.getNav()

  if (regResult) {
    req.flash(
      "notice",
      `New item ${inv_make, inv_model} added sucsessfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Manager",
      nav,
      links,
      classification,
    })
  } else {
    req.flash("notice", "Sorry, failed to add classification.")
    res.status(501).render("inventory/add-inventory", {
      title: "Classification Form",
      nav,
      errors: null,
    })
  }
}


/* ***** 
* Return Inventory by Classification As Json
* ***** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
*  edit inventory Name
* *************************************** */
// invCont.editInventory = async function (req, res, next) {
//   const inv_id = parseInt(req.params.inv_id)
//   const data = await invModel.getInfoByClassificationId(inv_id)
//   const grid = await utilities.buildIdGrid(data)
//   let nav = await utilities.getNav()
//   const classification = await utilities.buildClassificationList()
//   const inv_year = data[0].inv_year
//   const inv_make = data[0].inv_make
//   const  inv_model = data[0].inv_model
//   const inv_price = data[0].inv_price
//   res.render("./inventory/edit-inventory.ejs", {
//     title:  carMake + "  " + carModel,
//     nav,
//     // data
//     classification,
//     errors: null,
//     inv_id,
//     inv_make,
//     inv_model,
//     inv_year,
//     inv_description,
//     inv_image,
//     inv_thumbnail,
//     inv_price,
//     inv_miles,
//     inv_color,
//     classification_id,
//   })
// }

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInfoByClassificationId(inv_id)
  const classification = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory.ejs", {
    title: "Edit " + itemName,
    nav,
    classification,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}
  module.exports = invCont