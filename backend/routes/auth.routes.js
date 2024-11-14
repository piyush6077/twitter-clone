import express from "express";
import { handleSignUp, login, logout } from "../controller/auth.controller.js";

const router = express.Router()

router.post("/signup" , handleSignUp)


router.post("/login" , login)


router.post("/logout" , logout)


export default router;