import mongoose from "mongoose";

const {Schema} = mongoose;


const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ["user","admin"],
        default : "user"
    }

})

const User = mongoose.model('User', userSchema);

export default User;