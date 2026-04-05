const accountModel = require("../models/account.model")
const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")

async function createAccountByAythorityPermission(req, res) {
    try {

        const userIdJwt = req.query.userId
        const rejectIdJwt = req.query.rejectId

        if (rejectIdJwt) {
            const decode = jwt.verify(rejectIdJwt, process.env.jwtSecret)
            const rejectId = decode.userId

            const user = await userModel.findOne({
                _id: rejectId
            })

            // emailService.sendAccRejection(user.name, user.email)

            return res.status(401).json({
                msg: "your applicatioon for account opening has been regected"
            })
        }

        if (userIdJwt) {

            const decode = jwt.verify(userIdJwt, process.env.jwtSecret)
            const userId = decode.userId


            const findAccoount = await accountModel.findOne({
                user: userId
            }).select("+userType")
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

    } catch (err) {
        return res.status(401).json({
            error: err
        })
    }

}

async function createAccountByAuthority(req, res) {
    try {

        const { customerEmail } = req.body

        if (!customerEmail) {
            return res.status(401).json({
                Message: "user email is required for creating an account"
            })
        }
        const customer = await userModel.findOne({
            email: customerEmail
        })

        const findAccoount = await accountModel.findOne({
            user: customer._id
        })
        if (findAccoount) {
            return res.status(401).json({
                msg: "You already have an account. To create another account please create another userId"
            })
        }

        const account = await createUserAccount(customer._id)

        return res.status(201).json({
            acc: account,
            Message: "Account created successfully"
        })

    } catch (err) {
        return res.status(401).json({
            error: err
        })
    }
}

async function createAccountByUser(req, res) {
    try {
        // console.log(res.user)
        const findAccoount = await accountModel.findOne({
            user: res.user._id
        })
        if (findAccoount) {
            return res.status(401).json({
                msg: "You already have an account. To create another account please create another userId"
            })
        }

        const userId = jwt.sign({ userId: res.user._id }, process.env.jwtSecret)

        emailService.sendAuthority(res.user.name, res.user.email, userId)

        return res.status(201).json({
            msg: "Your account submission has taken and a token has been generated. Bank authority will verify your information. Your account will be created and account number with details will be sent to you shortly.  Thank you for using our app"
        })

    } catch (err) {
        return res.status(401).json({
            error: err
        })
    }

}


async function createUserAccount(userId) {
    const accNum = await createUniqueAccNum()
    const user = await userModel.findOne({
        _id: userId
    })
    const account = await accountModel.create({
        user: userId,
        accountNumber: accNum
    })

    // emailService.sendAccConfirmation(user.name, user.email, accNum)

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

async function checkBalaceHandler(req, res) {
    try {
        const account = await accountModel.findOne({
            user: res.user._id
        })

        if (!account) {
            return res.status(401).json({
                Message: "Account not found"
            })
        }

        const balance = await account.checkBalace()

        return res.status(201).json({
            Message: `Your account balance is ${balance}`
        })
    } catch (err) {
        return res.status(401).json({
            err
        })
    }

}

async function checkUserBalanceByAuthority(req, res) {
    try {
        const {userAccountNumber} = req.body

        if (!userAccountNumber) {
            return res.status(401).json({
                Message: "user account number is required to check balance"
            })
        }
        const account = await accountModel.findOne({
            accountNumber: userAccountNumber
        })

        if (!account) {
            return res.status(401).json({
                Message: "Account not found"
            })
        }

        const balance = await account.checkBalace()

        return res.status(201).json({
            Message: `Your account balance is ${balance}`
        })
    } catch (err) {
        return res.status(401).json({
            err
        })
    }

}

module.exports = {
    createAccountByUser,
    checkBalaceHandler,
    createAccountByAuthority,
    createAccountByAythorityPermission,
    checkUserBalanceByAuthority
}