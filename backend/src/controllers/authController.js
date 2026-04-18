//api list
// /api/auth/register - post registerUser
// /api/auth/login - post  loginUser
// /api/auth/profile - get getUserProfile

const User = require("../models/User");


//regester user
const registerUser =async (req,res)=>{
    try{
        const{name , email,password,phone}=req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Please enter all fields" });
        };
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        };
        const user = await User.create({
            name,
            email,
            password, // Note: User model mein hashing wala logic kaam karega
            phone
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: "User registered successfully!"
            });
        }

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports = { registerUser };