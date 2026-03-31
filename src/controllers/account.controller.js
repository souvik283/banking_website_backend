const sendEmail = require("../services/email.service")
const accountModel = require("../models/account.model")
const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")

async function createAccountHandler(req, res) {
    try {

        const userIdJwt = req.query.userId

        if (userIdJwt) {

            if (userIdJwt == 'reject') {
                return res.status(401).json({
                    msg: "your applicatioon for account opening has been regected"
                })
            }

            const decode = jwt.verify(userIdJwt, process.env.jwtSecret)
            const userId = decode.userId


            const findAccoount = await accountModel.findOne({
                user: userId
            })
            if (findAccoount) {
                return res.status(401).json({
                    msg: "This already have an account with account number : "
                })
            }

            const account = await createUserAccount(userId)

            return res.status(201).json({
                msg: `The user account has created successfully`,
                acc: account
            })

        }



        // console.log(res.user)
        const findAccoount = await accountModel.findOne({
            user: res.user._id
        })
        if (findAccoount) {
            return res.status(401).json({
                msg: "You already have an account. To create another account please create another userId"
            })
        }


        if (res.user.userType == "Customer") {

            const userId = jwt.sign({ userId: res.user._id }, process.env.jwtSecret)

            sendEmail.sendAuthority(res.user.name, res.user.email, userId)

            return res.status(201).json({
                msg: "Your account submission has taken and a token has been generated. Bank authority will verify your information. Your account will be created and account number with details will be sent to you shortly.  Thank you for using our app"
            })
        } else {
            const { customerEmail } = req.body

            const customer = await userModel.findOne({
                email: customerEmail
            })

            const account = await createUserAccount(customer._id)

            return res.status(201).json({
                acc: account,
                Message: "Account created successfully"
            })

        }

    } catch (err) {
        return res.status(401).json({
            error: err
        })
    }


}


async function createUserAccount(userId) {
    const accNum = await createUniqueAccNum()
    const account = await accountModel.create({
        user: userId,
        accountNumber: accNum
    })

    return account
}

function generateAccNum() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

async function createUniqueAccNum() {

    let accNumber;
    let exsits = true;

    while (exsits) {
        accNumber = generateAccNum();
        const account = await accountModel.findOne({
            accountNumber: accNumber
        });

        if (!account) {
            exsits = false
        }
    }

    return accNumber

}

module.exports = {
    createAccountHandler, createUserAccount
}