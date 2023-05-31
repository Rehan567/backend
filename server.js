const jwt = require("jsonwebtoken")
require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const productRoutes = require("./routes/product.js");

const Product = require("./model/productModel.js");
const router = require("./routes/product.js");
const auth = require("./routes/auth.js");
const Register = require("./model/usermodel.js");
const app = express();

const middleware = (req, res, next) => {
  console.log(`hello middleware`);
  next();
};

// Link the route file
// app.use(require('./routes/auth.js'));
app.use(express.json());

app.use(auth);




const port = process.env.PORT || 3000;
const product_routes = require("./routes/product.js");
const connectDB = require("./db/connect.js");
app.use("/api/products", product_routes);
app.use("/api/products", productRoutes);
app.use("/",auth)

app.use(express.urlencoded({ extended: false }));

// Middleware to set router
app.use(middleware);



// Routes
app.get("/", (req, res) => {
  res.send("hello there!");
});

app.get('/abouts', (req, res) => {
  console.log(`hello my abouts`);
  res.send(`hello about from the server`);
});

app.get("/about", (req, res) => {
  res.send("welcome to about people");
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//
// use post request 
app.post("/register",async(req,res)=>{
  try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if(password===confirmPassword){
          const userdata = new Register({
              fullname:req.body.fullname,
              email:req.body.email,
              mobile:req.body.mobile,
              password:req.body.password,
              confirmPassword:req.body.confirmPassword
          });
          const token = await userdata.mytoken();
          console.log("my token is "+ token);
          
          res.cookie("jwt",token,{
              expires:new Date(Date.now() +50000),
              httpOnly:true
          });
          const savedata = await userdata.save();
          res.status(201).render("home");
        }
  } catch (error) {
      res.status(400).send(error)
      
  }
});

app.post("/login",async(req,res)=>{
 try {
      const email = req.body.email;
      const password  = req.body.password;
  const useremail = await Register.findOne({email:email});
  const token = await useremail.mytoken();
  console.log("This is my token "+ token);

  res.cookie("jwt",token,{
      expires:new Date(Date.now() +50000),
      httpOnly:true
  });
  if(useremail.password===password){
      res.status(201).render("home")
  }else{
      res.send("invalid login details")
  }
 } catch (error) {
  res.status(400).send("invalid login detail")
 }
});

// Create a product
app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
    console.log(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Find a product
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    // If we can't find the data in the database
    if (!product) {
      return res.status(404).json({ message: `CANT FIND THE DATA OF THIS ID ${id}` });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: `the id${id} you are trying to delete is not available here.. please check it again` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const start = async () => {
  try {
    await connectDB(process.env.MongoDB);
    app.listen(port, () => {
      console.log(`${port} yes I am connected`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
