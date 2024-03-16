const exp=require("express");
const router=exp.Router();
const user=require("../models/User");


//Signup as User 
router.post("/signup",async (req,res)=>{
    try{
        const data=req.body;
        const response=user.create(data);
        res.json(response);
    }
    catch(err){
        res.json(err);
    }
})

//login as User
router.post("/login",async (req,res)=>{
   
    try {
        const { aadharNumber, password } = req.body;
        const user2 = await user.findOne({ aadharNumber });

        if (!user2) {
            return res.status(401).json({ message: 'Invalid Aadhar Number' });
        }
        const user3 = await user.findOne({ password });
        if(!user3){
            return res.status(401).json({ message: 'Invalid Password' });
        }
        else{
            res.status(200).json({ message: 'Login successful' });
        }
        

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error baal' });
    }  
    
})

router.get("/:profileId",async (req,res)=>{
    const id=req.params.profileId;
    try{
        const current=await user.findById(id);
        res.json(current);
    }
    catch(err){
        res.json(err);
    }
})

router.put("/password/:profileId",async (req,res)=>{
    const id=req.params.profileId;
    const {currentpassword,newPassword}=req.body;
    try{
        const data=await user.findById(id);
        if(!data){
            res.json({
                message:"No user found"
            });
        }
        if(currentpassword !== data.password){
            res.json({
                message:"Invalid Password for user"
            });
        }
        data.password = newPassword;
        await data.save();

        res.json({
            message:"Password Updated Successfully"
        });
    }
    catch(err){
        res.json(err);
    }
})
module.exports=router;