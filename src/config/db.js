const mongoose = require("mongoose")

 function connectDb() {
    
mongoose.connect(process.env.mongo_uri)
.then(()=>{
    console.log("server is connected to database")
}).catch((err)=>{
    console.log(`error to connect database: ${err}`)
    process.exit(1)
})

}

module.exports = connectDb