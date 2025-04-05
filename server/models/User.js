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
    }
)

const User = mongoose.model("user",userSchema)

export default User