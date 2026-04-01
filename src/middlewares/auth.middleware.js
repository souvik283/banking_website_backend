const jwt = require("jsonwebtoken")
const userModel = require("../models/user.models")
const { json } = require("express")

async function checkUserlogin(req, res, next) {

    const token = req.cookies.token
    // console.log(req.cookies.token,req.headers.token, token)
    if (!token) {
        return res.status(401).json({
            message: `please Signin first before creating a account`
        })
    }
    try {
        const decode = jwt.verify(token, process.env.jwtSecret)

        const user = await userModel.findById(decode.id).select("+userType")


        if (!user) {

            return res.status(401).json({
                message: "Token is not valid. Please Signin again"
            })
        }

        res.user = user

        return next()

    } catch (error) {
        return res.status(401).json({
            error: error
        })
    }

}


async function checkAuthoritylogin(req, res, next) {

    const token = req.cookies.token
    // console.log(req.cookies.token,req.headers.token, token)
    if (!token) {
        return res.status(401).json({
            message: `please Signin first before creating a account`
        })
    }
    try {
        const decode = jwt.verify(token, process.env.jwtSecret)

        const user = await userModel.findById(decode.id).select("+userType")


        if (!user) {

            return res.status(401).json({
                message: "Token is not valid. Please Signin again"
            })
        }

        if (user.userType === "Employee" || user.userType === "Manager") {
            res.user = user

            return next()
        }else{
            return res.status(403).json({
                message: "Your access has been denied"
            })
        }

    } catch (error) {
        return res.status(401).json({
            error: error
        })
    }

}



module.exports = { 
    checkUserlogin,
    checkAuthoritylogin
}