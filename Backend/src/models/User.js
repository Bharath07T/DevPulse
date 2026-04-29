import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            trim : true,
            required : [true, "UserName is required"],
            minLength : 3
        },
        email : {
            type : String,
            unique : true,
            index : true,
            required : [true, "Email Id is required"],
            trim : true
        },
        password : {
            type : String,
            required : [true, "Password must be specified"],
            minLength : 6,
        }
    },
    {
        timestamps : true
    }
);

userSchema.pre("save", async function (){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);
export default User;