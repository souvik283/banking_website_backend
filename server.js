require("dotenv").config()

const app = require("./src/app")
const port = process.env.port

const connectDb = require("./src/config/db")

connectDb()

app.listen(port, ()=>{
    console.log(`Server Started at Port : ${port}`)
})
