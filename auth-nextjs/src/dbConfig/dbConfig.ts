import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;

        connection.on("connect", () => {
            console.log("MongoDB connected successfully");
        });

        connection.on("error", (error) => {
            console.log("MongoDB connection error", error);
            process.exit(1);
        });
    } catch (error) {
        console.log("Error connecting mongoDB");
        console.log(error);
    }
}
