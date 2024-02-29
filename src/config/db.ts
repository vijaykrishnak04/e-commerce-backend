import mongoose from "mongoose";

const dbConnect = async () => {
  const dbUri = process.env.MONGO_URL as string;

  if (!dbUri) {
    console.error("MongoDB connection URI is missing in environment variables.");
    process.exit(1); // Stop the process if the database connection URI is not provided
  }

  try {
    await mongoose.connect(dbUri, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      // Additional options if necessary:
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Could not connect to MongoDB...", err);
    process.exit(1); // Stop the process if the database connection fails
  }
};

export default dbConnect;
