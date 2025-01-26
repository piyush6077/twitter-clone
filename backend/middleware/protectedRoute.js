//  protectedRoute is the middleware / function which is use to decode
//  the jwt token sent by the user during the updateProfile / deletePost 
//  methods run by the user , it will check if the jwt token is valid or 
// not , it will check the authenticity of the user 

import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res , next) =>{
    // here the next symbolize what to do after the current function protectedRoute is runned means in the router file the next function to the current function should run that is getMe function 
    try {
        const token = req.cookies.jwt; //we cant directly get it we need to add another middelware that is cookieParser
        if(!token){
            return res.status(400).json({error: "UnAuthorized : no token provided"})
        }
        
        // if we have token
        const decoded = jwt.verify(token , process.env.JWT_SECRET) // Here this line means first verify the token and then decoded it using the JWT_SECRET
   
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