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
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    header,
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
  let header =""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  const carYear = data[0].inv_year
  const carMake = data[0].inv_make
  const  carModel = data[0].inv_model
  const carPrice = data[0].inv_price
  res.render("./inventory/details.ejs", {
    title: carYear + " " + carMake + "  " + carModel+ "  $" +carPrice,
    nav,
    header,
    grid,
  })
}

invCont.buildInventoryManager = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  
  const classification = await utilities.buildClassificationList()
  let links = await utilities.buildInvManager()
  res.render("inventory/management.ejs", {
    title: "Inventory Manager",
    header,
    nav,
    links,
    classification,
  })
}
invCont.buildClassificationName = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  res.render("inventory/add-classification.ejs", {
    title: "Classification Form",
    nav,
    header,
    errors: null,
  })
}

/******new value */
invCont.removeClassificationName = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  res.render("inventory/delete-classification.ejs", {
    title: "Delete classification Form",
    nav,
    header,
    errors: null,
  })
}

/***** */

invCont.buildinventoryName = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header =""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
    let classification = await utilities.buildClassificationList()
  res.render("inventory/add-inventory.ejs", {
    title: "Classification Form",
    nav,
    header,
    classification,
    errors: null,
  })
}

/*****
 * Error function
****** */
invCont.errorType500 = async function (req, res, next) {
    let nav = await utilities.getNav()
    let header = ""
    if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  let classification = await utilities.buildClassificationList()
  let links = await utilities.buildInvManager()
  req.flash("alert", "a 500 error")
  res.status(500).render("inventory/error", {
    title: "500 Error",
    nav,
    header,
    classification,
    links,
  })
}


/* ****************************************
*  update inventory Name
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let links = await utilities.buildInvManager()
  const classification = await utilities.buildClassificationList()
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  const { 
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventoryItem(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
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
    res.status(501).render("inventory/edit-inventory.ejs", {
      title: "Edit " + itemName,
      nav,
      header,
      classification: classification,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
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
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  const classification = await utilities.buildClassificationList()

  if (regResult) {
    req.flash(
      "notice",
      `New classification ${classification_name} added sucsessfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Manager",
      nav,
      header,
      links,
      classification,
    })
  } else {
    req.flash("notice", "Sorry, failed to add classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Classification Form",
      nav,
      header,
      errors,
    })
  }
}

/******
 * Delete Classification name
 ******/
invCont.deleteClassificationName = async function (req, res, next) {
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
    let links = await utilities.buildInvManager()
    const classification = await utilities.buildClassificationList()
    const {classification_name} = req.body
    const classData = await invModel.deleteClassificationName(classification_name)
    let nav = await utilities.getNav()
    if (classData) {
    req.flash(
      "notice",
      `The classification ${classification_name} was removed sucsessfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Manager",
      nav,
      header,
      links,
      classification,
    })
  } else {
    req.flash("notice", "Sorry, failed to delete classification.")
    res.status(501).render("inventory/delete-classification", {
      title: "Delete classification Form",
      nav,
      header,
      errors,
    })
  }

  res.render("inventory/delete-classification.ejs", {
    title: "Delete Classification Form",
    nav,
    header,
    errors: null,
  })
}


/* ****************************************
*  Process inventory Name
* *************************************** */
invCont.addInventoryName = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  let links = await utilities.buildInvManager()
  const classification = await utilities.buildClassificationList()
  const { 
    inv_make, 
    inv_model,  
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year,
    inv_miles, 
    inv_color, 
    classification_id,
  } = req.body

  const insResult = await invModel.addInventoryItem(
    inv_make, 
    inv_model,  
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year,
    inv_miles, 
    inv_color, 
    classification_id
  )

  if (insResult) {
    req.flash(
      "notice",
      `New item ${inv_make, inv_model} added sucsessfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Manager",
      nav,
      header,
      links,
      classification,
    })
  } else {
    req.flash("message warning", "Sorry, failed to add vehicle.")
    res.status(201).render("inventory/add-inventory", {
      title: "Classification Form",
      nav,
      header,
      classification,
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
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  const itemData = await invModel.getInfoByClassificationId(inv_id)
  const classification = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory.ejs", {
    title: "Edit " + itemName,
    nav,
    header,
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


/* ***************************
 *  Build confirm-delete inventory view
 * ************************** */
invCont.CheckDeleteItem = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
  const itemData = await invModel.getInfoByClassificationId(inv_id)
  const classification = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm.ejs", {
    title: "delete " + itemName,
    nav,
    header,
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

/* ****************************************
*  Delete inventory Item
* *************************************** */
invCont.accDeleteItem = async function (req, res, next) {
  let links = await utilities.buildInvManager()
  const classification = await utilities.buildClassificationList()
  const { 
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const deleteResult = await invModel.deleteInventoryItem(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )
  let nav = await utilities.getNav()
  let header = ""
  if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }

  if (deleteResult) {
    const itemName = inv_make +" "+ inv_model;
    req.flash(
      "notice",
      `The item ${itemName} deleted sucsessfully.`
    )
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, failed to delete inventory item.")
    res.status(501).render("inventory/edit-inventory.ejs", {
      title: "Edit " + itemName,
      nav,
      header,
      classification: classification,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

  module.exports = invCont