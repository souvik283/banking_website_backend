const mongoose = require("mongoose")
const ledgerModel = require("./ledger.model")


const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associate with valid user"],
        index: true
    },
    accountNumber: {
        type: Number,
        required: [true, "Account must be associate with valid account number"],
        trim: true,
        unique: true,
        default: 0
    },
    status: {
        type: String,
        enum:{
            values: ["ACTIVE", "FROZEN", "CLOSED"]
        },
        default: "ACTIVE"
    },
    ruppes:{
        type: String,
        required: [true, "Curency is required for creating a account"],
        default: "INR"
    }

},
{timestamps: true})


accountSchema.methods.checkBalace = async function() {

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

const accountModel = mongoose.model("account", accountSchema)

module.exports = accountModel; 