const express = require("express");
const morgan = require("morgan");
const adminRouter = require("./routes/adminRoutes"); 
const instructorRouter = require("./routes/instructorRoutes");
const courseRouter = require("./routes/courseRoutes");
const studentRouter = require("./routes/studentRoutes");
const app = express();

app.use(express.json()) //BODY PARSER
app.use(morgan("dev")) //CAHNGE FOR PROD

app.use("/admin",adminRouter);
app.use("/instructor",instructorRouter);
app.use("/course",courseRouter);
app.use("/student",studentRouter);

module.exports = app;