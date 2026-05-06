const mongoose = require('mongoose');

const uri = "mongodb://abuzarmshahi783_db_user:abuzarmshahi783_db_user@ac-yjm5kfi-shard-00-00.tl0ibei.mongodb.net:27017,ac-yjm5kfi-shard-00-01.tl0ibei.mongodb.net:27017,ac-yjm5kfi-shard-00-02.tl0ibei.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-105gia-shard-0&authSource=admin&retryWrites=true&w=majority";

async function test() {
    try {
        console.log("Connecting to MongoDB (Direct)...");
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("SUCCESS: Connected to MongoDB!");
        process.exit(0);
    } catch (err) {
        console.error("CONNECTION FAILED:");
        console.error(err);
        process.exit(1);
    }
}

test();
