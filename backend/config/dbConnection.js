import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.CONNECTION_STRING);

    console.log(
      "Connected to MongoDB:",
      connection.connection.host,
      connection.connection.name
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDb;
