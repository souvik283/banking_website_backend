const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: [true, "Email already exsits"],
        trim: true,
        lowercase: true,
        match: [/^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Enter a valid Email"]
    },
    name: {
        type: String,
        required: [true, "Please provide your name"],

    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password should contain more then 6 charecter"],
        select: false
    },
    userType: {
        type: String,
        enum: {
            values: ["Customer", "Employee", "Manager"],
            message: "user can either be manager, employee or customer"
        },
        default: "Customer"
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function () {
    if (!this.isModified) {
        return
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    return
})

userSchema.methods.comparePassword = async function (password) {

    // console.log(this.password)
    // console.log(password)

    return await bcrypt.compare(password, this.password)
    
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel