import express from "express";
import { getMe, handleSignUp, login, logout } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router()

router.get("/me",  protectedRoute , getMe) // here protectRoute is the middleware created by us
router.post("/signup" , handleSignUp)
router.post("/login" , login)
router.post("/logout" , logout)


export default router;