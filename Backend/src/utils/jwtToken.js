import jwt from 'jsonwebtoken';
import env from '../config/env.js'

const tokenGenerator = (user) => {
    const token = jwt.sign(
        { _id : user._id, email : user.email, username : user.username },
        env.jwtSecret,
        { expiresIn : "7d" }
    );

    return token;
}

export default tokenGenerator;