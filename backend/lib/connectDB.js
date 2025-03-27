import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("連線MongoDB成功!");
    } catch (err) {
        console.log(err);
    }
}