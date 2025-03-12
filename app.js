const express= require('express');
const app=express();
const db = require('./config/mongoose-connection')
const cookieparser = require('cookie-parser');
app.use(cookieparser());
const path = require('path');
require("dotenv").config();
const ownerRouter = require('./routes/ownerRouter');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productsRouter');
const isLoggedin = require('./middlewares/isLoggedin');
const productModel = require('./models/product-model');
const userModel = require('./models/user-model');
const expresSession = require('express-session');
const flash = require('connect-flash');


app.use(expresSession({
    secret: "ducky",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"views")));
app.set("view engine","ejs");

app.use("/owners",ownerRouter);
app.use("/users",userRouter);
app.use("/products",productRouter); 
app.listen(3000);


// app.get("/", (req, res) => {
//     res.render("home", { error: req.flash("error") }); 
// });


app.get("/", (req, res) => {
    res.send("hello welcome");
});

app.get("/shop", isLoggedin, async (req, res) => {
    let { sort, minPrice, maxPrice, search } = req.query;

    let filter = {};
    
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    let query = productModel.find(filter);

    if (sort) {
        if (sort === "low") query = query.sort({ price: 1 });
        if (sort === "high") query = query.sort({ price: -1 });
        if (sort === "latest") query = query.sort({ createdAt: -1 });
        if (sort === "popular") query = query.sort({ popularity: -1 });
    }

    let products = await query.exec();
    res.render("shop", { products, success: req.flash("success") });
});

app.get("/cart", isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");
    res.render("cart", { user });
});



app.get("/addtocart/:id", isLoggedin, async (req, res) => {
   

    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success","product added successfully");
    res.redirect("/shop");


    
});



app.get("/removefromcart/:id", isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    // 🔥 Remove the product ID from the cart array
    user.cart = user.cart.filter(item => item.toString() !== req.params.id);

    await user.save();
    req.flash("success", "Product removed from cart");
    res.redirect("/cart");
});


app.get("/checkout", isLoggedin, async (req, res) => {
    res.render("checkout");
});

module.exports = app;
