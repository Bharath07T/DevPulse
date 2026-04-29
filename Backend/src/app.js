import express from 'express';
import morgan from 'morgan';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import env from './config/env.js';
import errorHandler from './middlewares/errorMiddleware.js';
import router from './routes/index.js';

const app = express();

app.use( helmet() );

app.use( morgan( 'dev' ) );

app.use(
    cors({
        origin : env.clientUrl,
        credentials : true
    })
);

const limiter = rateLimiter({
    windowMs : 15 * 60 * 1000,
    max : 100,
    message : "Too many requests, Please try again later"
});

app.use( limiter );

app.use( express.json() );
app.use( express.urlencoded( { extended : true } ) );

app.get("/", (req, res) => {
    res.send("API running");
});

app.use("/api", router);

app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.statusCode = 404;
    next(error);
});

app.use(errorHandler);

export default app;