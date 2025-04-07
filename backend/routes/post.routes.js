import e from 'express'
import {protectedRoute} from '../middleware/protectedRoute.js'
import { createPost, deletePost } from '../controller/post.controller.js'
const router = e.Router()

router.post("/create", protectedRoute, createPost)
router.delete("/:id" , protectedRoute , deletePost)
router.post("/")

export default router;