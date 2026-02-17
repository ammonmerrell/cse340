const util = require("../utilities/index")
const model = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { accDeleteItem } = require("./invController")
require("dotenv").config()

/* *****
* Deliver Login View
* ***** */
async function  buildLogin(req,res, next) {
    let nav = await util.getNav()
    let header = ""
    if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
    res.render("account/login", {
        title: "login",
        header,
        nav,
        errors: null,
    })    
}

/* *****
* Deliver register view
* ***** */
async function registerUser(req, res, next) {
    let nav = await util.getNav()
    
    let header = ""
    if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
    // let accData = accountData.account_firstname
    res.render("account/register", {
        title: "Register",
        header,
        nav,
        errors: null,

    })
}

/* *****
Process Registration
* ***** */
async function registerAccount(req, res){
    let nav = await util.getNav()
    let header = ""
    let accData = accountData.account_firstname
    if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
    const { account_firstname, account_lastname, account_email, account_password} = req.body

    //Hash
    let hashedPassword
    try {
        //regular password and cost (salt generated automaticly)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("message failure", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            header,
            nav,
            errors: null,

        })
    }

    const regResult = await model.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "message success",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "login",
            header,
            nav,
            errors: null,
        })
    } else {
        req.flash("message warning", "Sorry, the registration failed.")
        let accData = accountData.account_firstname
        res.status(501).render("account/register", {
            title: "Registration",
            header,
            nav,
            errors: null,

        })
    }
}

async function buildAccReg(req, res) {
    let nav = await util.getNav();
    let accData = res.locals.accountData.account_firstname
    let header = ""
    if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
    res.render("account/account-register", {
        
        title: "You're logged in.",
        header,
        nav,
        errors: null,
        accData,

})
}
/* *****
* Process login request
* ***** */
async function accountLogin(req, res) {
    let nav = await util.getNav()
    let header = ""
    if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
    const { account_email, account_password } = req.body
    const accountData = await model.getAccountByEmail(account_email)
    let accData = accountData.account_firstname
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            header,
            nav,
            errors: null,
            account_email,
            accData,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})
            console.log("acces token: "+accessToken)
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credencials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                header,
                nav,
                errors: null,
                account_email,
                account_firstname,
            })
        } 
    } catch (error) {
            throw new Error('Acces Forbidden')
        }
    
    }

    /*****
     * Logout of account
     * ***** */
    async function logoutAcc(req, res) {
    let nav = await util.getNav();
    let accData = ""
    let header = ""
    if(res.locals.loggedin){
        header += "<a title=\"Click to log out\" href=\"/account/logout\">Log Out</a\> </div\>"
    } else{
        header += "<a title=\"Click to log in\" href=\"/account/login\">My Account</a\>  </div\>"
    }
    res.clearCookie('jwt')
    res.render("account/account-register", {
        title: "You're logged out.",
        header,
        nav,
        errors: null,
        accData,

})
}

module.exports = {buildLogin, registerUser, registerAccount, accountLogin, buildAccReg, logoutAcc}