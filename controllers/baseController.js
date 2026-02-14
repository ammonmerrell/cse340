const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    let header = ""
    if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
    res.render("index", {title: "Home", nav, header})
}

module.exports = baseController