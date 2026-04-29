import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
    "PORT",
    "CLIENT_URL",
    "NODE_ENV",
    "JWT_SECRET",
    "MONGO_URI",
    "API_KEY"
];

requiredEnvVars.forEach( (key) => {
    if(!process.env[key]){
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
});

const env = {
    port : process.env.PORT,
    clientUrl : process.env.CLIENT_URL,
    nodeEnv : process.env.NODE_ENV,
    jwtSecret : process.env.JWT_SECRET,
    mongouri : process.env.MONGO_URI,
    ApiKey : process.env.API_KEY  
};

export default env;