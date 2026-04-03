const express= require("express")
const middleware = require("../middlewares/auth.middleware")
const accountHandler = require("../controllers/account.controller")
const router = express.Router()

router.post("/", middleware.checkUserlogin, accountHandler.createAccountHandler)

router.post("/check/balance", middleware.checkUserlogin, accountHandler.checkBalaceHandler)

module.exports = router