const express = require('express')
const router = express.Router();
const taxController = require('../controller/taxController')
const { verifyToken } = require('../middleware/auth.middleware');
const { queryValidation } = require("../validators");
const { queryLimiter } = require("../rateLimiter");

router.post('/calculateTax', taxController.calculateTax);
router.post('/register', taxController.register)
router.post('/login', taxController.login)
router.post('/contactUs', queryLimiter, queryValidation, taxController.contactUs)

// Authenticated API's

// CESS API's
router.post('/admin/addCess', verifyToken, taxController.addCess)
router.post('/admin/updateCess', verifyToken, taxController.updateCess)
router.get('/admin/getCess', verifyToken, taxController.getAllCess)
router.delete('/admin/deleteCess/:id', verifyToken, taxController.deleteCess)

// Surcharge API's
router.post('/admin/addSurcharge', verifyToken, taxController.addSurcharge)
router.post('/admin/updateSurcharge', verifyToken, taxController.updateSurcharge)
router.get('/admin/getSurcharge', verifyToken, taxController.getAllSurcharge)
router.delete('/admin/deleteSurcharge/:id', verifyToken, taxController.deleteSurcharge)

// New Regime API's
router.post('/admin/addIncomeTax', verifyToken, taxController.addIncomeTax)
router.post('/admin/updateIncomeTax', verifyToken, taxController.updateIncomeTax)
router.get('/admin/getIncomeTax', verifyToken, taxController.getAllIncomeTax)
router.delete('/admin/deleteIncomeTax/:id', verifyToken, taxController.deleteIncomeTax)

// Old Regime API's
router.post('/admin/addOldIncomeTax', verifyToken, taxController.addOldIncomeTax)
router.post('/admin/updateOldIncomeTax', verifyToken, taxController.updateOldIncomeTax)
router.get('/admin/getOldIncomeTax', verifyToken, taxController.getAllOldIncomeTax)
router.delete('/admin/deleteOldIncomeTax/:id', verifyToken, taxController.deleteOldIncomeTax)

// Rebate API
router.post('/admin/addRebate', verifyToken, taxController.addRebate)
router.post('/admin/updateRebate', verifyToken, taxController.updateRebate)
router.get('/admin/getRebate', verifyToken, taxController.getAllRebates)
router.delete('/admin/deleteRebate/:id', verifyToken, taxController.deleteRebate)

// Old Rebate API
router.post('/admin/addOldRebate', verifyToken, taxController.addOldRebate)
router.post('/admin/updateOldRebate', verifyToken, taxController.updateOldRebate)
router.get('/admin/getOldRebate', verifyToken, taxController.getAllOldRebates)
router.delete('/admin/deleteOldRebate/:id', verifyToken, taxController.deleteOldRebate)

// Latest Update API
router.post('/admin/addLatestUpdate', verifyToken, taxController.addLatestUpdate)
router.post('/admin/updateLatestUpdate', verifyToken, taxController.updateLatestUpdate)
router.get('/admin/getLatestUpdate', taxController.getAllLatestUpdates)
router.get('/admin/getTop10LatestUpdate', taxController.getTop10LatestUpdates)
router.get('/admin/getLatestUpdate/:id', taxController.getLatestUpdateById)
router.delete('/admin/deleteLatestUpdate/:id', verifyToken, taxController.deleteLatestUpdate)

module.exports = router;