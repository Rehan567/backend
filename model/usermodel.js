const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const userSchema= new mongoose.Schema({
    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    mobile:{
        type:Number,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    confirmPassword:{
        type:String,
        require:true
    },
    tokens: [
        {
          token: {
            type: String,
            required: true
          }
        }
      ]
});


//generating tokens
userSchema.methods.mytoken=async function(){
    try {
   
        const id = this.id.toString()
        const token = jwt.sign({_id:id},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token});
   
        await this.save();
        return token;
    } catch (error) {
        res.send("this is my error"+error)
        console.log("this is my error" + error)
    }
}


// create Collection 

const Register= new mongoose.model("Register",userSchema);

module.exports = Register;

