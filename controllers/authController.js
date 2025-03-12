const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const productModel = require("../models/product-model");
module.exports.registerUser = async function (req, res) {
    try {
        let { fullname, email, password } = req.body;
        let finduser = await userModel.findOne({ email });

        if (finduser) {
            return res.status(401).send("You already have an account, please login");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await userModel.create({
            fullname,
            email,
            password: hashedPassword
        });

        console.log(user);
        
        let newUser = {
            fullname: user.fullname,
            email: user.email,
            _id: user._id
        };

        res.send(newUser); // ✅ Only send safe data

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.loginUser = async function (req, res) {
    try {
        console.log("called");
        let { email, password } = req.body;
        let user = await userModel.findOne({ email });

        if (!user) {
            console.log("User not found");
            return res.status(401).send("You need to register first");
        }

        // ✅ Using `await` to properly handle bcrypt
        let match = await bcrypt.compare(password, user.password);
        if (match) {
            console.log("Password is correct");
            let token = generateToken(user);

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

                let products = await productModel.find();
                let success ="you have logged in successfully";
                return res.render("shop",{products,success});
        }

        return res.status(401).send("Wrong password");

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

// ✅ Logout Function
module.exports.logout = async function (req, res) {
    console.log("logout called");
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    return res.redirect("/");
};
