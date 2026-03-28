const express = require("express")
const transactionHandler = require("../controllers/transaction.controller")

const router = express.Router()

router.post("/", transactionHandler.transactionHandler)

module.exports = router