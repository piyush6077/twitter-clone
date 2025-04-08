import Notification from "../model/notification.model.js"

export const getNotifications = async(req, res) => {
    try {
        const userId = req.user._id

        const notification = await Notification.find({ to: userId})
            .sort({ createdAt: -1})
            .populate({
                path: "from",
                select: "username profileImg"
            })

        await Notification.updateMany({ to:userId},{read: true})
        
        return res.status(200).json({success: true , notification})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false , message: "Internal Server Error"})
    }
}

export const deleteNotifications = async(req, res) => {
    try {
        const userId = req.user._id
    
        await Notification.deleteMany({ to: userId})
    
        return res.status(200).json({success: true , message: "All Notifications Deleted" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false , message: "Internal Server Error"})    
    }
}

export const deleteNotification = async(req, res) => {
    try {
        const notificationId = req.params.id
        
        await Notification.findByIdAndDelete(notificationId)
    
        return res.status(200).json({ success: true , message:"Notification deleted Successfully"})
    } catch (error) {
        console.log(error) 
        return res.status(200).json({ success: false , message:"Internal Server Error"})      
    }
}