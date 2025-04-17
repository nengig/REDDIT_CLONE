import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        email:{
            type: String,
            require:true,
            unique:true,
            trim:true,
            lowercase:true
        },
        username:{
            type:String,
            require:true,
            trim:true,
            lowercase:true,
            unique:true
        },
        password:{
            type: String,
            require:true,
            
        }, 
        createdAt:{ 
            type: Date, 
            default: Date.now
        },
    }
)

const User = mongoose.model("User", userSchema)

export default User