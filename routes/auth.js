
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")

require('../db/connect.js');
const User = require("../model/productModel.js");
const Register = require("../model/productModel.js")

router.get('/', (req, res) => {
  res.send(`hello moto`);
});

const auth = async (req, res, next) => {

  try{
    const token = req.cookies.jwt;
    const verifyUser =  jwt.verify(token,process.env.MongoDB)
    const document = await Register.findOne({_id:verifyUser._id});
    req.token= token;
    req.document= document;
    next();
  }
  catch(error){
    res.status(401).send(error)

  }
}

router.post('/products', async (req, res) => {
  const { name, quantity, price, image,email, password, confirmPassword } = req.body;

  if (!name || !quantity || !price || !image || !email || !password || !confirmPassword) {
    return res.status(422).json({ error: "Please fill all the fields properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
    } else if (password !== confirmPassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    } else {
      const newUser = new User({ name, quantity, price, image, email, password, confirmPassword });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
