const accountModel = require("../models/account.model")
const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const userModel = require("../models/user.models")
const mongoose = require("mongoose")

async function transactionHandler(req, res) {

    const { toAccount, amount, idempotecyKey } = req.body

    if (!toAccount || !amount || !idempotecyKey) {
        return res.status(402).json({
            msg: "For a transaction formAccount, toAccount, amount and idempotecyKey are required"
        })
    }


    const fromUserAccount = await accountModel.findOne({
        user: res.user._id
    }).select("_id status")

    const toUserAccount = await accountModel.findOne({
        accountNumber: toAccount
    }).select("_id status")

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            msg: "fromUserAccount or toUserAccount is invalid"
        })
    }


    const istransactionExsist = await transactionModel.findOne({
        idempotecyKey: idempotecyKey
    }).select("status")

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


    if (fromUserAccount.status === "CLOSED" || toUserAccount.status === "CLOSED" || fromUserAccount.status === "FROZEN" || toUserAccount.status === "FROZEN") {
        return res.status(401).json({
            msg: "fromUserAccount or toUserAccount may be closed or frezed. Please check it"
        })
    }



    const balance = await fromUserAccount.checkBalace()

    if (amount > balance) {
        return res.status(402).json({
            message: `Insufficient balance. Current balance is ${balance}. Amount required ${amount}`
        })
    }

    // create transaction model

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const [transaction] = await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount: toUserAccount._id,
            amount: amount,
            idempotecyKey,
            status: "Pending"
        }], { session })

        await ledgerModel.create([{
            accountId: fromUserAccount._id,
            transactionId: transaction._id,
            type: "Debit",
            amount: amount

        }], { session })

        await ledgerModel.create([{
            accountId: toUserAccount._id,
            transactionId: transaction._id,
            type: "Credit",
            amount: amount

        }], { session })

        transaction.status = "Successfull"
        await transaction.save({ session })

        await session.commitTransaction()
    } catch (error) {
        await session.abortTransaction()
        return res.status(402).json({
            error
        })

    }
    finally {
        session.endSession()
    }

        return res.status(202).json({
        message: "Transaction Successful"
    })
}




async function authorityDepositHandler(req, res) {
    const { toAccount, amount, idempotecyKey } = req.body

    if (!toAccount || !amount || !idempotecyKey) {
        return res.status(402).json({
            msg: "For a transaction  toAccount, amount and idempotecyKey are required"
        })
    }


    const fromUserAccount = await accountModel.findOne({
       user: res.user._id
    })

    const toUserAccount = await accountModel.findOne({
        accountNumber: toAccount
    })

    if (!toUserAccount) {
        return res.status(400).json({
            msg: "toUserAccount is invalid"
        })
    } else if (!fromUserAccount) {
        return res.status(400).json({
            msg: "System User Not Found"
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
        } else if (istransactionExsist.status === "Successfull") {
            return res.status(500).json({
                msg: "Transaction is completed"
            })
        } else if (istransactionExsist.status === "Reversed") {
            return res.status(500).json({
                msg: "Transaction is reversed. Please check Your account"
            })
        } else {
            return res.status(500).json({
                msg: "Transaction is failed try after a while"
            })
        }
    }


    if (fromUserAccount.status === "CLOSED" || toUserAccount.status === "CLOSED" || fromUserAccount.status === "FROZEN" || toUserAccount.status === "FROZEN") {
        return res.status(401).json({
            msg: "fromUserAccount or toUserAccount may be closed or frezed. Please check it"
        })
    }



    const session = await mongoose.startSession();

    try {
        session.startTransaction()

        const [transaction] = await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount: toUserAccount._id,
            amount: amount,
            idempotecyKey,
            status: "Pending"
        }], { session })

        await ledgerModel.create([{
            accountId: fromUserAccount._id,
            transactionId: transaction._id,
            type: "Debit",
            amount: amount

        }], { session })

        await ledgerModel.create([{
            accountId: toUserAccount._id,
            transactionId: transaction._id,
            type: "Credit",
            amount: amount

        }], { session })

        transaction.status = "Successfull"
        await transaction.save({ session })

        await session.commitTransaction()
    } catch (error) {
        await session.abortTransaction()
        return res.status(402).json({
            error
        })

    }
    finally {
        session.endSession()
    }

    return res.status(202).json({
        message: "Transaction Successful"
    })


}




module.exports = {
    transactionHandler, authorityDepositHandler
}