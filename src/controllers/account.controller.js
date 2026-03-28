
const accountModel = require("../models/account.model")


async function createAccountHandler (req, res){
    try {
        // console.log(res.user)
        const findAccoount = await accountModel.findOne({
            user: res.user._id
        })
        if (findAccoount) {
           return res.status(401).json({
                msg:"You already have an account. To create another account please create another userId"
            })
        }

        // if (res.user.userType == "Customer") {
        //     return res.status(201).json({
        //         msg: "Your account submission has taken and a token has been generated. Bank authority will verify your information. Your account will be created and account number with details will be sent to you shortly.  Thank you for using our app"
        //     })
        // }
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