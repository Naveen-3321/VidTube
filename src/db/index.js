import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const Connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(`DB Connected ! DB host: ${Connection.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Connection error,${error}`);
    process.exit(1);
  }
};

export default connectDB;
