const mongoose = require("mongoose")


const transactionSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accoount"
    },
    
})