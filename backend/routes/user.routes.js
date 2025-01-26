import express from "express"
import { protectedRoute } from "../middleware/protectedRoute.js"
import { followUnfollowUser, getProfile, getSuggestedUsers, updateUserProfile } from "../controller/user.controller.js"

const router = express.Router()

router.get("/profile/:username" , protectedRoute , getProfile)
router.get("/suggested" , protectedRoute , getSuggestedUsers )
router.post("/follow/:id" , protectedRoute , followUnfollowUser)
router.post("/update" , protectedRoute , updateUserProfile)

export default router;