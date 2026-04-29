import mongoose from "mongoose";
import env from './env.js';

const dbConnector = async function(){
    try{
        await mongoose.connect(env.mongouri, {
            serverSelectionTimeoutMS : 5000
        });

        console.log("DB connected Successfully");

    }catch(error){

        console.error("DB failed to connect", error);
        process.exit(1);

    }
}

export default dbConnector;