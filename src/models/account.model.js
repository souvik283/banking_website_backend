const mongoose = require("mongoose")


const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associate with valid user"],
        index: true
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

const accountModel = mongoose.model("account", accountSchema)

module.exports = accountModel; 