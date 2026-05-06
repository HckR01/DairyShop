//api list
// /api/auth/register - post registerUser
// /api/auth/login - post  loginUser
// /api/auth/profile - get getUserProfile---pending
// /api/auth/profile - put updateUserProfile
// /api/auth/profile - delete deleteUser
// /api/auth/logout - post logoutUser
//database file....................
const User = require("../models/User");
//jwt token....................
const generateToken = require('../utils/generateToken');
//bcrypt....................
const bcrypt = require('bcryptjs');
//regester user....................
const registerUser =async (req,res)=>{
    try{
        const{name , email,password,phone}=req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Please enter all fields" });
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone.toString())) {
            return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
        }

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
                role: user.role,
                token: generateToken(user._id),
                message: "User registered successfully!"
            });
        }

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
//login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ email });

        
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), 
            });
            
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3 Update Profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.phone) {
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(req.body.phone.toString())) {
                    return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
                }
                user.phone = req.body.phone;
            }
            user.address = req.body.address || user.address;
            // Agar user naya password bhi bheje
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({ message: "Profile Updated!", name: updatedUser.name });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Delete User Account
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.json({ message: "User removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//logout
const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), 
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
module.exports = { registerUser,loginUser,getUserProfile,updateUserProfile,deleteUser,logoutUser };