const sendEmail = require("../services/email.service")
const accountModel = require("../models/account.model")
const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")

async function createAccountHandler (req, res){
    try {

        const userIdJwt = req.query.userId

        if (userIdJwt) {
            const decode = jwt.verify(userIdJwt, process.env.jwtSecret)
            const userId = decode.userId


         const findAccoount = await accountModel.findOne({
            user: userId
        })
        if (findAccoount) {
           return res.status(401).json({
                msg:"This already have an account with account number : "
            })
        }

            const account = await createUserAccount(userId)

            return res.status(201).json({
                msg:  `The user account has created successfully`,
                acc: account
            })

        }



        // console.log(res.user)
        const findAccoount = await accountModel.findOne({
            user: res.user._id
        })
        if (findAccoount) {
           return res.status(401).json({
                msg:"You already have an account. To create another account please create another userId"
            })
        }


        if (res.user.userType == "Customer") {

            const userId = jwt.sign({userId: res.user._id}, process.env.jwtSecret)

            sendEmail.sendAuthority(res.user.name, res.user.email, userId)

            return res.status(201).json({
                msg: "Your account submission has taken and a token has been generated. Bank authority will verify your information. Your account will be created and account number with details will be sent to you shortly.  Thank you for using our app"
            })
        }else{
            const { customerEmail }= req.body

          const customer =  await userModel.findOne({
            email: customerEmail
          })

         const account = await createUserAccount(customer._id)

        }

    } catch (err) {
        return res.status(401).json({
            error: err
        })
    }
   
    return res.status(201).json({
        Message: "Account created successfully"
    })
}


    async function createUserAccount(userId) {

        const account = await accountModel.create({
        user: userId
    })

    return account
    }

module.exports= {
    createAccountHandler, createUserAccount
}