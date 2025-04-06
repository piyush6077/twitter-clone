import e from 'express'
import {protectedRoute} from '../middleware/protectedRoute.js'
const router = e.Router()

router.post("/create", protectedRoute, createPost)

export default router;