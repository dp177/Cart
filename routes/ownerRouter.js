const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

router.get("/", function (req, res) {
    res.send("meaw");
});
router.get("/admin", function (req, res) {
    let success = req.flash("success");
    res.render("createproduct",{success});
});
// router.post("/create",  (req, res) => {
//     res.send("ouch");
// });
 console.log(process.env.NODE_ENV);

router.get("/createproduct",(req,res)=>{
    if (process.env.NODE_ENV !== "development") {
        return res.status(403).send("This route is only available in development mode.");
    }
    let success = req.flash("success");
    res.render("createproduct",{success});
})
if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
            let {fullname,email,password} = req.body;
            let owners =await ownerModel.find();
            if(owners.length>0)
            {
                res.send("you cannot be second owner")
            }
            else
            {
            
               let createdOwner =  await ownerModel.create({
                    fullname,
                     email,
                    password,
                })
                res.status(201).send(createdOwner);
            }
           
    });
    
}


module.exports = router;
