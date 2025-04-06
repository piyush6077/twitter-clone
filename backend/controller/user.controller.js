import User from "../model/user.model.js"
import Notification from "../model/notification.model.js";

export const getProfile = async (req , res) => {
    const {username} = req.params;

    try {
        const user = await User.findById({username}).select("-password")
        if (!user) return res.status(404).json({message: "User not found"})
    
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message})
    }
}

export const followUnfollowUser = async (req,res) => {
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id)   // the user we wanted to follow or unfollow
        const currentUser = await User.findById(req.user._id)  // this is me / current user 

        if(id === req.user._id.toString()) return res.status(400).json({error: "you cant follow yourself"})

        if(!userToModify || !currentUser) return res.status(400).json({error: "user not found"})

        const isFollowing = currentUser.following.includes(id)  // this lines checks whelther the following array consist the current user (id) means checks if the current user is following the user 
        if(isFollowing){
            // Unfollow the user 
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id}})  //pulling our id in user following array
            await User.findByIdAndUpdate(req.user._id , { $pull: { following: id}}) //pulling user id in our following array  
            res.status(200).json({message: "User unfollowed successfully"})
        }
        else{
            //Follow the user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id}})  //pushing our id in user following array
            await User.findByIdAndUpdate(req.user._id , { $push: { following: id}}) //pushing user id in our following array  
            // send notification to the user 
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            })
 
            await newNotification.save() // newNotification saved to Database
            // ToDO : return the id of user in the response 
            res.status(200).json({message: "User followed successfully"})
        }


    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message})
    }
}

export const getSuggestedUsers = async (req,res) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following")

        const users = await User.aggregate([
            {
                $match: {
                    _id: {$ne: userId}   // this means match ids which are notequal( ne )  to userId 
                }
            },
            { $sample: { size: 10 }}           // give us a sample user with the size of 10ll  
        ])

        const filteredUser = users.filter((user) => !userFollowedByMe.following.includes(user._id))
        const suggestedUser = filteredUser.slice(0,4);

        suggestedUser.forEach(users=>users.password=null)

        res.status(200).json({suggestedUser})
    } catch (error) {
        console.log("Error occured " , error.message)
        res.status(400).json({error: error.message})       
    }


}

export const updateUserProfile  = async (req,res)  => {
    const { fullname , email , username , currentPassword , newPassword } = req.body // if a user wanted to update there profile they will provide us this field 
    
    if ( !fullname || !email || !username || !currentPassword || !newPassword){
        return res.status(400).json("details are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email,
                username,
                currentPassword: newPassword
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .json(user , "You Profile updated successfully")
}