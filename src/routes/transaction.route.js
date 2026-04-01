const express = require("express")
const transactionHandler = require("../controllers/transaction.controller")
const middleawre = require("../middlewares/auth.middleware")
const router = express.Router()

router.post("/", transactionHandler.transactionHandler)


router.post("/authority/deposit", middleawre.checkAuthoritylogin, transactionHandler.authorityDepositHandler)

module.exports = router