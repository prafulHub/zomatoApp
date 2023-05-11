const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3007;
const MONGODB_URI = "mongodb://127.0.0.1:27017/zomato-clone";
const APIRouter = require("./routes/APIRouter.js");


// enable cors policy
app.use(cors());

// enable incoming post data
app.use(express.json()); // json request
app.use(express.urlencoded({ extended: false }));
// form-data(data + file) or x-www-from-urlencoded (data)

// inject routing in our app
// we "use" => method it's a middleware
// /user , /admin , /
app.use("/api", APIRouter);
console.log("connecting to mongoDB database...");
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("connected with db sucessfully");
      console.log("project is running on port ", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });