const mongoose=require("mongoose");
const userScheme=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number
    },
    mobileNumber:{
        type:String,
    },
    address:{
        type:String,
        required:true
    },
    aadharNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }

})

const user=mongoose.model("user",userScheme);
module.exports=user;