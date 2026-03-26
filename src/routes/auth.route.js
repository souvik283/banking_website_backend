const express= require("express")
const userAuthController = require("../controllers/auth.controller")
const router = express.Router()

router.post("/register", userAuthController.registerHandler)
router.post("/login", userAuthController.loginHandler)

module.exports = router