import { Post } from "../model/post.model.js";
import { v2 as cloudinary} from 'cloudinary'
import User from "../model/user.model.js";
import Notification from "../model/notification.model.js";

export const createPost = async(req , res) => {
    try {
        const { text , img } = req.body;
        const authUser =  req.user._id
    
        if(!authUser) {
            return res.status(400).json({
            success: false , 
            message:"Needed to be authenticated to create Post"
        })}
    
        if(!text && !img ){
            return res.status(400).json({
                success: false , 
                message:"Cannot create post wihtout post details"
            })
        } 

        let imgUrl = img
        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img),
            imgUrl = uploadResponse.secure_url
        }
    
        const post = await Post.create({
            user: authUser,
            text,
            img: imgUrl
        })
         
        return res.status(200).json({message:"Created Post" , post})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false , message:"Internal server Error"})
    }
}

export const deletePost = async(req , res) => {
    try {
        const authUser = req.user._id
        const postId = req.params.id
    
        const existingPost = await Post.findById(postId)
        if(!existingPost) {
            return res.status(400).json({success:false , message: "No such post existed"})
        }
    
        //Got to know this today ".equals" method of mongodb
        if(!existingPost.user.equals(authUser)){
            return res.status(403).json({success:false , message: "Cannot delete another user Post"})
        }
    
        if(existingPost.img){
            const imgId = existingPost.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
    
        await Post.findByIdAndDelete(existingPost)
        return res.status(200).json({success:false , message: "Post deleted successfully"})
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false , message:"Internal server Error"})            
    }
}

export const likeUnlikePost = async(req , res) => {
    try {
        const postId = req.params.id
        const userId = req.user._id
    
        const post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({success:false , message:"Post not found"})
        }
    
        const userLikedPost = post.likes.includes(userId)
        if(userLikedPost){
            await Post.updateOne(
                {_id: postId}, 
                {$pull: { likes: userId}}
            )
            await User.updateOne(
                {_id: postId}, 
                {$pull: { likedPosts: userId}}
            )

            const updatedLikes = post.likes.filter((id)=> id.toString() !== userId.toString()) 
            return res.status(200).json(updatedLikes)
        } else {
            post.likes.push(userId);
            await User.updateOne(
                {_id: postId},
                {$push: {likedPosts: userId}}
            ) 
            await post.save()
    
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save()
    
            const updatedLikes = post.likes
            return res.status(200).json(updatedLikes)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: true ,message:"Internal server Error"})
    }
}

export const commentOnPost = async(req , res) => {
    try {
        const PostId = req.params.id
        const userId = req.user._id
        const { text } = req.body
        
        const post = await Post.findById(PostId)
        if(!post) {
            return res.status(400).json({
                status: false,
                message: "Cannot create comment without the text"
            })
        }
    
        if(!text){
            return res.status(400).json({
                status: false,
                message: "Cannot create comment without the text"
            })
        }
    
        const comment = {user: userId, text}
    
        post.comments.push(comment)
        await post.save()
    
        return res.status(200).json({success: true , message: post})
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false , message: "Internal server error"})
    }
}

export const getAllPosts = async(req , res) => {
    try {
        const userId = req.user._id 
        if(!userId){
            return res.status(400).json({success: false , message:"UnAuthenticated User"})
        }

        const allPosts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password "
        });
        //why we don't use .populate("user").select("-password") 
        // because when we use .populate we cannot deselect by using .select we have 
        // to write the code as we have written here

        if(allPosts.lenght === 0){
            return res.status(200).json([])
        }

        return res.status(200).json({data: allPosts})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false , message: "Internal Server Error"})
    }
}

export const getLikedPosts = async(req, res) => {
    const userId = req.params.id
    
    try {
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({success: false , message:"UnAuthenticated User"})
        }
        
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path:"comment.user",
            select: "-password"
        })

        return res.status(200).json({success: true , likedPosts})
    } catch (error) {
        
    }
}

export const getFollowingPosts = async(req, res) => {
    try {
        const userId = req.user._id
        
        const user = await User.findById(userId)
        if(!user) return res.status(400).json({success:false , message:"User not found"})

        const following = user.following
        
        const feedPosts = await Post.find({ user: {$in: following}})
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        return res.status(200).json({success: true , data: feedPosts})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false , message:"internal server error"})
    }
}


export const getUserPosts = async(req, res) => {
    const { username } = req.params

    try {
        const user = await User.findOne({username})
        if(!user) return res.status(400).json({success:false , message:"User not found"})

        const posts = await Post.find({ user: user._id})
            .sort({ createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        return res.status(200).json({success:true , message:"Fetch user posts successfully" , posts })
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false , message:"internal server error"})
    }
}