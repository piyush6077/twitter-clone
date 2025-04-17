import express from "express"
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv"
import connectMongoDB from "./db/connectMongoDB.js"
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js";
import cors from 'cors'
import { v2 as cloudinary } from "cloudinary";
dotenv.config()

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({ limit: '10mb' })); // increase limit here
app.use(express.urlencoded({ extended: true, limit: '10mb' }));app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/user" , userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/notification", notificationRoutes)

app.listen(PORT , ()=>{
    console.log("the server started at http://localhost:" + PORT)
    connectMongoDB();
})