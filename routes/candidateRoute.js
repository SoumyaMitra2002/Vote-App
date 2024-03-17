const exp = require("express");
const router1 = exp.Router();
const candidate = require("../models/Candidate");
const user = require("../models/User");


//Add-Candidate
router1.post("/:userId", async (req, res) => {
    try {
        const id = req.params.userId;
        const admin = await user.findById(id);
        if (!admin) {
            return res.status(404).json({
                message: "No user found"
            });
        }
        if (admin.role !== 'admin') {
            return res.status(404).json({
                message: "You are not admin"
            });
        }
        const candidate1 = req.body;
        const response = candidate.create(candidate1);
        return res.status(200).json(candidate1);
    }
    catch (err) {
        return res.status(403).json({
            message:err.message
        });
    }

})
//Update-Candidate
router1.put("/:candidateId/user/:userId", async (req, res) => {
    try {
        const id = req.params.userId;
        const cid = req.params.candidateId;
        const admin = await user.findById(id);
        const can = await candidate.findById(cid);
        if (!admin) {
            res.status(404).json({
                message: "No user found"
            });
        }
        if (admin.role !== 'admin') {
            return res.status(404).json({
                message: "You are not admin"
            });
        }
        if (!can) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }
        const x = await candidate.updateOne({
            "_id": cid
        }, req.body);
        res.json(x);
    }
    catch (err) {
        res.json(err);
    }

})

//Delete-Candidate
router1.delete("/:candidateId/user/:userId", async (req, res) => {
    try {
        const id = req.params.userId;
        const cid = req.params.candidateId;
        const admin = await user.findById(id);
        const can = await candidate.findById(cid);
        if (!admin) {
            return res.status(404).json({
                message: "No user found"
            });
        }
        if (admin.role !== 'admin') {
            return res.status(404).json({
                message: "You are not admin"
            });
        }
        if (!can) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }
        await candidate.deleteOne({ _id: cid });
        res.status(200).json({
            message: "done"
        })
    } catch (err) {
        res.json(err);
    }
})

//Vote Starting
router1.post("/vote/:userId/:candidateId", async (req, res) => {
    try {
        const data1 = req.params.userId;
        const data2 = req.params.candidateId;
        const user1 = await user.findById(data1);
        const candidate1 = await candidate.findById(data2);
        if (!user1) {
            return res.status(403).json({
                message: "No user found"
            });
        }
        if (!candidate1) {
            return res.status(403).json({
                message: "No candidate found"
            });
        }
        if (user1.role === "admin") {
            return res.status(403).json({
                message: "User is admin"
            });
        }
        if (user1.isVoted) {
            return res.status(403).json({
                message: "You have already voted"
            });
        }

        candidate1.votes.push({ user: data1 });
        candidate1.voteCount++;
        await candidate1.save();

        user1.isVoted = true;
        await user1.save();

        res.status(200).json({
            message: "Voted Successfully"
        });
    } catch (err) {
        res.status(403).json({
            message: "Error"
        });
    }
})

//Party-wise Vote with sorting
router1.get("/vote/count", async (req, res) => {
    try{
        const candidates = await candidate.find();
        const partyVoteMap=new Map();

        candidates.forEach((candidatewise)=>{
            const {party,voteCount}=candidatewise;
            if(partyVoteMap.has(party)){
                partyVoteMap.set(party,partyVoteMap.get(party)+voteCount);
            }
            else{
                partyVoteMap.set(party,voteCount);
            }
        })

        const finalResult=Array.from(partyVoteMap).map(([party,voteCount])=>({
            party,
            voteCount
        }));
        res.status(200).json(finalResult);
    }catch(err){
        res.status(403).json({
            message:"Error"
        });
    }
    
})

//List of Candidates
router1.get("/all", async (req,res)=>{
    const list=await candidate.find();
    res.status(200).json(list);
})


module.exports = router1;