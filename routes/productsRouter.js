const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async function (req, res) {
    let {image, name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    try {
        if (process.env.NODE_ENV !== "development") {
            return res.status(403).send("This route is only available in development mode.");
        }
        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        });

        req.flash("success", "Product created successfully");
        res.redirect("/owners/admin"); // Just redirect without passing extra data
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
