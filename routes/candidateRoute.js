const exp = require("express");
const router1 = exp.Router();
const candidate = require("../models/Candidate");
const user = require("../models/User");


//addCandidate
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
        res.json(response);
    }
    catch (err) {
        res.json(err);
    }

})

router1.put("/user/:userId/candidate/:candidateId", async (req, res) => {
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

router1.delete("/:candidateId/user/:userId", async (req, res) => {
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
        await candidate.deleteOne({ _id: cid });
        res.status(200).json({
            message: "done"
        })
    } catch (err) {
        res.json(err);
    }
})

module.exports = router1;