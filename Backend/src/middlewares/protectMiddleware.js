import env from '../config/env.js';
import jwt from 'jsonwebtoken';

const protectMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if(!token){
        const error = new Error("No Token provided");
        error.statusCode = 401;
        return next(error);
    }

    try{
        const decodedData = jwt.verify(token, env.jwtSecret);
        req.user = decodedData;
        next();
    }catch(error){
        error.statusCode = 401;
        next(error);
    }
};

export default protectMiddleware;