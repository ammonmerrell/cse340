// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const util = require("../utilities/index")
const regValidate = require("../utilities/classification-validation")
// Route to build inventory by classification view
router.get("/type/:classificationId", util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:classificationId", util.handleErrors(invController.buildByInv_id));
router.get("/", util.checkBasicLogin, util.handleErrors(invController.buildInventoryManager))
router.get("/add-classification", util.handleErrors(invController.buildClassificationName))
router.get("/error", util.handleErrors(invController.errorType500));
router.post(
    "/", 
    regValidate.classnameRules(), 
    regValidate.checkRegData, 
    util.handleErrors(invController.addClasificationName)
)

router.get("/add-inventory", util.handleErrors(invController.buildinventoryName))
router.post(
    "/add-inventory", 
    regValidate.inventoryRules(), 
    regValidate.checkInvData, 
    util.handleErrors(invController.addInventoryName)
)
router.get("/getInventory/:classification_id", util.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", util.handleErrors(invController.editInventory))

router.post(
    "/edit-inventory/", 
    regValidate.inventoryNewRules(),
    regValidate.checkEditData,
    util.handleErrors(invController.updateInventory))

router.get("/delete/:inv_id", util.handleErrors(invController.CheckDeleteItem))
router.post("/delete/",
    util.handleErrors(invController.accDeleteItem)    
)

module.exports = router;