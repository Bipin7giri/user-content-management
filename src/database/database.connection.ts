import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const databaseInit = (mongoUri?: string) => {
  const uri = mongoUri != null || process.env.DATABASE_MONGO_URL;

  try {
    void mongoose.connect(uri as string, {});
    const connection = mongoose.connection;
    console.log("Database connection established");
    return connection;
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};
