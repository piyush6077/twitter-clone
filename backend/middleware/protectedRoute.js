import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res , next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(400).json({error: "UnAuthorized : no token provided"})
        }
        
        const decoded = jwt.verify(token , process.env.JWT_SECRET)    
        if(!decoded){
            return res.status(400).json({error: "Unauthorized: Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(400).json({error: "User not found"})
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({error: "Not found`"})
    }
} 