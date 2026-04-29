import env from '../config/env.js';

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;

    res.status( statusCode ).json({
        success : false,
        message : err.message || "Internal Server Error",
        errors : err.errors || undefined,
        stack : env.nodeEnv === "development" ? err.stack : undefined
    });
}

export default errorHandler;