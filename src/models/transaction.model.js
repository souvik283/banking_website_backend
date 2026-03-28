const mongoose = require("mongoose")


const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accoount",
        required: true,
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accoount",
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
        type: String,
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

const userModel = mongoose.model("transaction", transactionSchema)

module.exports = userModel