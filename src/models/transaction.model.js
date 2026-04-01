const mongoose = require("mongoose")
const ledgerModel = require("./ledger.model")
const { $where } = require("./account.model")

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true
    },
    status:{
        type: String,
        enum:{
            values: ["Pending", "Successfull", "Reversed", "Failed"],
            message:["Transaction can either be Pending, Successfull, Reversed, Failed"]
        },
        default: ["Pending"]
    },
    amount: {
        type: Number,
        required: [true, "ammount is required for transaction"],
        min: [0, "ammount cannot be negative"]
    },
    idempotecyKey:{
        type: String,
        required: [true, "idempotecyKey is required for creating any transaction"],
        unique: true,
        index: true
    }
    
}, {
    timestamps: true
})

transactionSchema.methods.checkBalace = async function() {

    const balanceData = await ledgerModel.aggregate([
        {$match: {accountId: this._id}},
        {$group: {
            _id: null,
            totalDebit:{
                $sum:{
                    $cond: [
                        {$eq: ["$type", "Debit"]},
                        "$amount",
                        0
                    ]
                }
            },
            totalCredit:{
                $sum:{
                    $cond: [
                        {$eq: ["$type", "Credit"]},
                        "$amount",
                        0
                    ]
                }
            }
        }
    },
    {
        $project:{
            _id: 0,
            balance: { $subtract: ["$totalCredit", "$totalDebit"]}
        }
    }
    ])

    if (balanceData.length === 0) {
        return 0
    }
    
return balanceData[0].balance

}


const transactionModel = mongoose.model("transaction", transactionSchema)

module.exports = transactionModel