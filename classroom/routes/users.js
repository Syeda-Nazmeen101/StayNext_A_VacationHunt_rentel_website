const express = require("express");
const router = express.Router();

//users
router.get("/",(req,res)=>{
    res.send("hi,iam in update");
});

router.get("/:id",(req,res)=>{
    res.send("hi,iam in delete");
});

router.post("/",(req,res)=>{
    res.send("hi,iam in delete");
});

router.delete("/:id",(req,res)=>{
    res.send("hi,iam in delete");
});

module.exports = router;