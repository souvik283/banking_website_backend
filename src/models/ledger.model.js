const mongoose = require("mongoose")


const ledgerSchema= new mongoose.Schema({
    accountId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true,
        immutable: true
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: "true",
        index: true,
        immutable: true
    }, 
    type:{
       type: String,
       enum:{
        values: ["Debit", "Credit"],
        message: "type either be debit or credit"
       },
       required: [true, "ledger must have a type"],
       immutable: true
    },

},{
    timestamps: true
})

 function preventData() {

    throw new Error("Ledger entries are immutable cannot be changed or modified by anyone"); 
}

ledgerSchema.pre("deleteMany", preventData)
ledgerSchema.pre("deleteOne", preventData)
ledgerSchema.pre("findOneAndDelete", preventData)
ledgerSchema.pre("findOneAndReplace", preventData)
ledgerSchema.pre("findOneAndUpdate", preventData)
ledgerSchema.pre("replaceOne", preventData)
ledgerSchema.pre("updateMany", preventData)
ledgerSchema.pre("updateOne", preventData)


const ledgerModel = mongoose.model("ledger", ledgerSchema)

module.exports = ledgerModel