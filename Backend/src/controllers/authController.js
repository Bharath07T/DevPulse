import User from '../models/User.js';
import tokenGenerator from '../utils/jwtToken.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    try{
        const existUser = await User.findOne({ email });
        if(existUser){
            const error = new Error("User Already Exists");
            error.statusCode = 409;
            return next(error);
        }

        const newUser = new User({
            username, 
            email,
            password
        });
        const savedUser = await newUser.save();

        const token = tokenGenerator(savedUser);

        res.status(201).json({
            _id : savedUser.id,
            username : savedUser.username,
            email : savedUser.email,
            token
        });

    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            return next(error);
        }

        const comparedPassword = await bcrypt.compare(password, user.password);

        if (!comparedPassword) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            return next(error);
        }

        const token = tokenGenerator(user);

        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token
        });

    }catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    try{
        const user = await User.findById(req.user._id).select("-password");

        if(user){
            res.status(200).json( user );
        }else{
            const error = new Error("User not found");
            error.statusCode = 404;
            next(error);
        }

    }catch(error){
        if(error.name === "CastError"){
            error.statusCode = 400;
            error.message = "Invalid ID format";
        }
        next(error);
    }
}