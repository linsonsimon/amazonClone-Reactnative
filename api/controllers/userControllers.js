const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//function to send verification email to the user
const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transport
  const transporter = nodemailer.createTransport({
    //configure the email service
    service: "gmail",
    auth: {
      user: "linsonsimon1@gmail.com",
      pass: "xebz yrqf ozei kmyt",
    },
  });

  const mailOpions = {
    from: "amazon.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email : http://localhost:8000/api/user/verify/${verificationToken}`,
  };

  //send the email
  try {
    await transporter.sendMail(mailOpions);
  } catch (error) {
    console.log("error sending verification email", error);
  }
};

//endpoint to register in the app
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if email is registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //create new user
    const newUser = new User({ name, email, password });

    //generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user to the database
    await newUser.save();

    //send verification email to the user
    await sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

//endpoint to login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "invalid email" });
    }
    if (user.password !== password) {
      res.status(401).json({ message: "invalid password" });
    }

    //generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    };

    res.status(200).json({ userData });
  } catch (error) {
    res.status(500).json({ message: "login Failed" });
    console.log("error login", error);
  }
};

//get user data
const getUser = async (req, res) => {
  try {
    const userData = req.user;
    res.status(200).json({ userData });
  } catch (error) {
    res.status(401).json({ message: "user not found" });
  }
};

//endpoint to verify the email address
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email Verification failed" });
  }
};

//endpoint to store a new address
const saveAddresses = async (req, res) => {
  try {
    console.log(req.body);
    const { address } = req.body;

    if (!address) {
      return res.status(401).json({ message: "invalid input" });
    }

    const user = await User.findById(req.user._id).select("-password");

    user.addresses.push(address);

    await user.save();

    return res.status(200).json({ message: "address created successfully" });
  } catch (error) {
    res.status(401).json({ message: "Error adding address" });
  }
};

//endpoint to get all the address of a particular user
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(401).json({ message: "invalid token" });
    }

    return res.status(200).json(user.addresses);
  } catch (error) {
    res.status(401).json({ message: "Error adding address" });
  }
};

module.exports = {
  getAddresses,
  saveAddresses,
  verifyEmail,
  getUser,
  login,
  register,
};
