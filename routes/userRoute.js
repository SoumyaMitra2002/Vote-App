const exp = require("express");
const router = exp.Router();
const user = require("../models/User");


//Signup as User 
router.post("/signup", async (req, res) => {
    const data = req.body;
    const { aadharNumber,role } = data
    let isConflict=false;
    // let isConflict2=false;
    try {
        const list = await user.find();
        list.forEach((user1) => {
            if (user1.aadharNumber === aadharNumber) {
                isConflict=true;
                return;
            }
            // if (user1.role === "admin") {
            //     isConflict2 = true;
            //     return;
            // }
        })
        if (isConflict) {
            return res.status(403).json({
                message: "Aadhar Number is already present"
            });
        }
        // if (isConflict2) {
        //     return res.status(403).json({
        //         message: "Admin is already present"
        //     });
        // }
        const response = user.create(data);
        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(403).json(err.message);
    }
})

//Login as User
router.post("/login", async (req, res) => {

    try {
        const { aadharNumber, password } = req.body;
        const user2 = await user.findOne({ aadharNumber });

        if (!user2) {
            return res.status(401).json({ message: 'Invalid Aadhar Number' });
        }
        const user3 = await user.findOne({ password });
        if (!user3) {
            return res.status(401).json({ message: 'Invalid Password' });
        }
        else {
            res.status(200).json({ message: 'Login successful' });
        }


    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

})

//Getting the profile
router.get("/:profileId", async (req, res) => {
    const id = req.params.profileId;
    try {
        const current = await user.findById(id);
        res.json(current);
    }
    catch (err) {
        res.json(err);
    }
})


//Change Password
router.put("/password/:profileId", async (req, res) => {
    const id = req.params.profileId;
    const { currentpassword, newPassword } = req.body;
    try {
        const data = await user.findById(id);
        console.log(data);
        if (!data) {
            return res.status(403).json({
                message: "No user found"
            });
        }
        if (currentpassword !== data.password) {
            return res.status(403).json({
                message: "Invalid Password for user"
            });
        }
        data.password = newPassword;
        await data.save();

        return res.status(200).json({
            message: "Password Updated Successfully"
        });
    }
    catch (err) {
        return res.json(err.message);
    }
})
module.exports = router;