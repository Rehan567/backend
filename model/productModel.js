
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    price: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Custom validator function
          return value === this.confirmPassword;
        },
        message: "Passwords do not match",
      },
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    tokens:[{
      token : {
        type: String,
        require : true
      }
    }]
  });


// generating token

productSchema.methods.mytoken = async function(){
  try{
      const token = jwt.sign({_id:this.id.toString()},process.env.MongoDB)
      this.token = this.token.concat({token : token})
      await this.save();
      return token;
  }catch(error){
    res.send("this is my error " + error)
    console.log("this is my error" + error);

  }
}

productSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password') || this.isNew) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
      this.confirmPassword = await bcrypt.hash(this.confirmPassword, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
