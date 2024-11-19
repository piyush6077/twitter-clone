import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookies } from "../lib/utils/generateToken.js";


export const handleSignUp = async (req,res)=>{
    try{
        const {fullname , username, email , password} = req.body;
        const emailRegex = /[a-z0-9]+@[a-z0-9]+\.[a-z0-9]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Email format is invalid"});
        }

        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({error:"Username is already taken"});
        }

        const existingEmail = await User.findOne({ email })  // Here the email is same as email : email  just as we did in the username section  new update of js 
        if(existingEmail){
            return res.status(400).json({error:"Email is already taken"})
        }

        if (password.length < 6 ){
            return res.status(400).json({error:"password length is to short"})
        }

        // Hash password using bcrypt

        const salt = await bcrypt.genSalt(10);
        const hashedPassword  = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname, // fullname : fullname
            username, // username : username
            email,    // email : email
            password:hashedPassword,
        })

        if(newUser){
            generateTokenAndSetCookies(newUser._id,res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                fullname: newUser.fullname,
                followers:newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg:newUser.coverImg,
            })
        }
        else{
            res.status(500).json({error:"Invalid user data"});
        }

    }
    catch(error){
        console.log(error)
        return res.status(400).json({error:"something went wrong"})
    }
}

export const login =  async (req,res)=>{
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password , user?.password || "")
        
        if(!user || !isPasswordCorrect){
            res.status(400).json({error:"username or password is incorrect"})
        }

        //if success then
        generateTokenAndSetCookies(user._id, res)
        
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            followers:user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg:user.coverImg
        })
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({error:"something went wrong"})
    }
}

export const logout =  (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({error:"something went wrong"})
    }
}


export const getMe = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error is getMe controller", error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}