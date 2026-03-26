const express= require("express")
const checkuserLogin = require("../middlewares/auth.middleware")
const accountHandler = require("../controllers/account.controller")
const router = express.Router()

router.post("/", checkuserLogin.checkUserlogin, accountHandler.createAccountHandler)

module.exports = router