import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    fullname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required: true,
        minLength: 6,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    followers:[
        // follwoers are more than one so they are represented by array 
        {
            type: mongoose.Schema.Types.ObjectId , 
            ref:"user",
            default: []  // users will have 0 followers when they first signup
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId , 
            ref:"user",
            default: []  // users will have 0 followers when they first signup
        }
    ],
    profileImg:{
        type: String,
        default: "",
    },
    coverImg:{
        type: String,
        default: "",
    },
    bio:{
        type:String,
        default: "",
    },
    link:{
        type:String,
        default:"",
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ]
},
{
    timestamps:true
}
)
//timestamps : true give us updated as time / date and created at field

const User = mongoose.model("User" , userSchema);

export default User;