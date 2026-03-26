
const accountModel = require("../models/account.model")


async function createAccountHandler (req, res){
    try {
        const account = accountModel.create({
        user: res.user._id
    })
    } catch (err) {
        return res.status(401).json({
            error: err
        })
    }
   
    return res.status(201).json({
        Message: "Account created successfully"
    })
}

module.exports= {
    createAccountHandler
}