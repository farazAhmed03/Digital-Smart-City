import { MongoClient } from "mongodb";

export const client = new MongoClient(process.env.DB_URL);

export const connectMongoClient = async () => {
    try {
        await client.connect();
        const dbName = "DSCH"; // Matching line 9
        console.log(`MongoDB native client connected to database: ${dbName} ✅`);
        return client.db(dbName);
    } catch (err) {
        console.error("❌ Mongo client connection error:", err.message);
        process.exit(1);
    }
};