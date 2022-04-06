const express = require("express");
const morgan = require("morgan");
const adminRouter = require("./routes/adminRoutes"); 
const instructorRouter = require("./routes/instructorRoutes");
const app = express();

app.use(express.json())
app.use(morgan("dev")) //CAHNGE FOR PROD

app.use("/admins",adminRouter);
app.use("/instructors",instructorRouter);
module.exports = app;