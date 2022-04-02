const express = require("express");
const morgan = require("morgan");
const adminRouter = require("./routes/adminRoutes"); 
const app = express();

app.use(express.json())
app.use(morgan("dev")) //CAHNGE FOR PROD

app.use("/admins",adminRouter);

module.exports = app;