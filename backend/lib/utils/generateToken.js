import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookies = (userId , res) => {
    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {
            expiresIn: '15d'
        }
    )
    
    res.cookie("jwt", token,{
        maxAge: 15*24*60*60*1000,  // 15 days
        httpOnly:true,    // prevent XSS attacks cross-site scripting attacks 
        // basically means that this token cannot be accessed by javascript and something similar like that can be only accessed through http    
        sameSite: "strict",  // CSRF attacks cross-site request forgery attacks
        secure: false // secure gone be true if process.env.NODEENV is not development

    })
}