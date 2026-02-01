// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const util = require("../utilities/index")
const regValidate = require("../utilities/classification-validation")
// Route to build inventory by classification view
router.get("/type/:classificationId", util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:classificationId", util.handleErrors(invController.buildByInv_id));
router.get("/", util.handleErrors(invController.buildInventoryManager))
router.get("/add-classification", util.handleErrors(invController.buildClassificationName))
router.post(
    "/", 
    regValidate.classnameRules(), 
    regValidate.checkRegData, 
    util.handleErrors(invController.addClasificationName)
)

router.get("/add-inventory", util.handleErrors(invController.buildinventoryName))
router.post(
    "/add-inventory", 
    regValidate.classnameRules(), 
    regValidate.checkRegData, 
    util.handleErrors(invController.addInventoryName)
)
module.exports = router;