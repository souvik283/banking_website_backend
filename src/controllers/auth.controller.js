const bcrypt = require("bcryptjs")
const emailService = require("../services/email.service")
const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")

async function registerHandler(req, res) {
    const { email, name, password } = req.body

    const isEmailExist = await userModel.findOne({
        email: email
    })
    if (isEmailExist) {
        return res.status(422).json({
            massage: "This email is already registerd",
            status: "Failed"
        })
    }

    const user = await userModel.create({
        email, name, password
    })

    const token = await jwt.sign({ id: user._id, name: user.name }, process.env.jwtSecret, { expiresIn: 30000 })
    res.cookie("token", token)

     emailService.sendEmailtoUser(user.email, user.name)

    return res.status(201).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })


}

async function loginHandler(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email: email }).select("+password")
    if (!user) {
        return res.status(401).json({
            message: "Email & Password is Invalid"
        })
    }

    const isValid = await user.comparePassword(password)

    if (!isValid) {
        return res.status(422).json({
            alert: "Password is Inavalid. Please enter the Password correctly"
        })
    }

    const token = jwt.sign({id: user._id, name: user.name, lastUpdate: user.updatedAt}, 
        process.env.jwtSecret,
        {expiresIn: 30000}
    )
    res.cookie("token", token)

    emailService.sendMailLogin(user.email, user.name)

    return res.status(202).json({
       name: user.name
    })
}


module.exports = { registerHandler, loginHandler }