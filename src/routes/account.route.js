const express= require("express")
const middleware = require("../middlewares/auth.middleware")
const accountHandler = require("../controllers/account.controller")
const router = express.Router()

router.post("/", middleware.checkUserlogin, accountHandler.createAccountByUser)

router.post("/create", accountHandler.createAccountByAythorityPermission)

router.post("/create/authority", middleware.checkAuthoritylogin, accountHandler.createAccountByAuthority)

router.post("/check/balance", middleware.checkUserlogin, accountHandler.checkBalaceHandler)

router.post("/check/balance/authority", middleware.checkAuthoritylogin, accountHandler.checkUserBalanceByAuthority)

module.exports = router