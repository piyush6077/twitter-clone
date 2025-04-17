import User from "../model/user.model.js"
import Notification from "../model/notification.model.js";
import bcrypt from "bcryptjs"
import { v2 as cloudinary} from "cloudinary";

export const getProfile = async (req , res) => {
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select("-password")
        if (!user) return res.status(404).json({message: "User not found"})
    
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message})
    }
}

export const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "You can't follow yourself" });
		}

		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (!userToModify || !currentUser) {
			return res.status(400).json({ error: "User not found" });
		}

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			await User.findByIdAndUpdate(id, {
				$pull: { followers: req.user._id },
			});
			await User.findByIdAndUpdate(req.user._id, {
				$pull: { following: id },
			});

			const updatedCurrentUser = await User.findById(req.user._id);
			return res.status(200).json(updatedCurrentUser);
		} else {
			await User.findByIdAndUpdate(id, {
				$push: { followers: req.user._id },
			});
			await User.findByIdAndUpdate(req.user._id, {
				$push: { following: id },
			});

			const newNotification = new Notification({
				type: "follow",
				from: req.user._id,
				to: userToModify._id,
			});
			await newNotification.save();

			const updatedCurrentUser = await User.findById(req.user._id);
			return res.status(200).json(updatedCurrentUser);
		}
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	}
};

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

        res.status(200).json(suggestedUser)
    } catch (error) {
        console.log("Error occured " , error.message)
        res.status(400).json({error: error.message})       
    }
}

export const updateUserProfile = async (req, res) => {
    try {
      const {
        fullname,
        email,
        username,
        bio,
        link,
        currentPassword,
        newPassword,
        profileImg,
        coverImg
      } = req.body;
  
      // Get user from DB
      const user = await User.findById(req.user?._id);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      const updates = {};
  
        if (fullname) updates.fullname = fullname;
        if (email) updates.email = email;
        if (username) updates.username = username;
        if (bio) updates.bio = bio;
        if (link) updates.link = link;
    
        if (profileImg?.startsWith("data:image")) {
            const uploadedProfileImg = await cloudinary.uploader.upload(profileImg);
            updates.profileImg = uploadedProfileImg.secure_url;
        }
      
        if (coverImg?.startsWith("data:image")) {
            const uploadedCoverImg = await cloudinary.uploader.upload(coverImg);
            updates.coverImg = uploadedCoverImg.secure_url;
        }
      

      if (newPassword) {
        // Validate current password first
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Current password is incorrect" });
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        updates.password = hashedPassword;
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true }
      ).select("-password");
  
      return res.status(200).json({ data: updatedUser });
    } catch (error) {
      console.error("Update profile error:", error.message);
      return res.status(500).json({ error: "Something went wrong" });
    }
  };