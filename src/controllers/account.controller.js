
const accountModel = require("../models/account.model")


async function createAccountHandler (req, res){
    try {
        // console.log(res.user)
        if (res.user.userType == "Customer") {
            return res.status(201).json({
                msg: "Your account submission has taken and a token has been generated. Bank authority will verify your information and your account will be created shortly. thank you usin our app"
            })
        }
    //     const account = accountModel.create({
    //     user: res.user._id
    // })
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