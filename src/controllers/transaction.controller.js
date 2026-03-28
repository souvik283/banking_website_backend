const accountModel = require("../models/account.model")
const transactionModel = require("../models/transaction.model")
const userModel = require("../models/user.models")


async function transactionHandler(req, res) {

    const {fromAccount, toAccount, amount, idempotecyKey} = req.body

    if(!fromAccount||!toAccount||!amount||!idempotecyKey){
        return res.status(402).json({
            msg:"For a transaction formAccount, toAccount, amount and idempotecyKey are required"
        })
    }


    const fromUserAccount = await accountModel.findOne({
        user: fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        user: toAccount
    })

    if (!fromUserAccount||!toUserAccount) {
        return res.status(502).json({
            msg: "fromUserAccount or toUserAccount is invalid"
        })
    }

}

module.exports = {
    transactionHandler
}