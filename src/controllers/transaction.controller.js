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
        _id: fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if (!fromUserAccount||!toUserAccount) {
        return res.status(400).json({
            msg: "fromUserAccount or toUserAccount is invalid"
        })
    }


    const istransactionExsist = await transactionModel.findOne({
        idempotecyKey: idempotecyKey
    })

    if (istransactionExsist) {
        if (istransactionExsist.status === "Pending") {
            return res.status(500).json({
                msg: "Transaction is still pending. Please wait a while and then lodge a compalin"
            })
        }
        if (istransactionExsist.status === "Successfull") {
            return res.status(500).json({
                msg: "Transaction is completed"
            })
        }
        if (istransactionExsist.status === "Reversed") {
            return res.status(500).json({
                msg: "Transaction is reversed. Please check Your account"
            })
        }
        if (istransactionExsist.status === "Failed") {
            return res.status(500).json({
                msg: "Transaction is failed try after a while"
            })
        }
    }


    if (fromUserAccount.status === "CLOSED") {
        return res.status(401).json({
            msg:"fromUserAccount is already closed"
        })
    }
    if (toUserAccount.status === "CLOSED") {
        return res.status(401).json({
            msg:"toUserAccount is already closed"
        })
    }
    if (fromUserAccount.status === "FROZEN") {
        return res.status(401).json({
            msg:"fromUserAccount is currently under frezed. Transaction is not possible now"
        })
    }
    if (toUserAccount.status === "FROZEN") {
        return res.status(401).json({
            msg:"toUserAccount is currently under frezed. Transaction is not possible now"
        })
    }


    


}

module.exports = {
    transactionHandler
}