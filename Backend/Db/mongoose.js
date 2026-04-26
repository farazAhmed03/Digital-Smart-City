import mongoose from "mongoose";

export const connectMongoose = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            dbName: "DSCH"
        });
        console.log("Mongoose connected");
    } catch (err) {
        console.error("Mongoose connection error", err);
        process.exit(1);
    }
};