import express from "express"
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv"
import connectMongoDB from "./db/connectMongoDB.js"
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js";
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended:true})) // to parse from the data(urlencoded)
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/user" , userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/notification", notificationRoutes)

app.listen(PORT , ()=>{
    console.log("the server started at http://localhost:" + PORT)
    connectMongoDB();
})