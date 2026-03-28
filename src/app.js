const express = require("express")

const authRoute = require("./routes/auth.route")
const accountRoute = require("./routes/account.route")
const transactionRoute = require("./routes/transaction.route")
const cookieParser = require("cookie-parser")

const app = express()
app.use(express.urlencoded({ extended: false }))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use("/api/account", accountRoute)
app.use("/api/transaction", transactionRoute)

module.exports = app