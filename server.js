const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
    path:"./config.env"
})

const DB = process.env.DATABASE;

mongoose.connect(DB,{
    useNewUrlParser:true
}).then(conn => {
    console.log("Connection successfull");
})

const app = require("./app");

const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log("server started");
})