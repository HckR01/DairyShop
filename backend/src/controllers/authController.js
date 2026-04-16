//api list
// /api/auth/register - post registerUser
// /api/auth/login - post  loginUser
// /api/auth/profile - get getUserProfile

const User = require("../models/User");


//regester user
const registerUser =async (req,res)=>{
    try{
        const{name , email,password,phone}=req.body

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}