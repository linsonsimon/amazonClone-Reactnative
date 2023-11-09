const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("./models/user");
const Order = require("./models/order");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"))
  .catch((err) => console.log("error connecting to database", err));

app.listen(port, () => {
  console.log("Server is running on port", port);
});

app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", async (req, res) => {
  res.json({ message: "api working" });
});

// const generateSecretKey = () => {
//   const secretKey = crypto.randomBytes(32).toString("hex");
//   return secretKey;
// };

// const secretKey = generateSecretKey();
