import { Post } from "../model/post.model";
import { v2 as cloudinary} from 'cloudinary'

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
            return res.status(404).json({
                success: false , 
                message:"Cannot create post wihtout post details"
            })
        } 

        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img)
            img = uploadResponse.secure_url
        }
    
        const post = await Post.create({
            user: authUser,
            text,
            img
        })
         
        return res.status(200).json("Created Post" , post)
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
    
        if(img){
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
            return res.status(200).json({message: "Post unliked successfully"})
        } else {
            post.likes.push(userId);
            await post.save()
    
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save()
    
            return res.status(200).json({success: true ,message:"Post like successfully"})
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