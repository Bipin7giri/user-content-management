import { databaseInit } from "../database/database.connection";
import { Role } from "../roles/roles.schema";
import { User } from "../users/user.schema";
import { generateHashPassword } from "../utils/hashpassword";
import mongoose from "mongoose";

databaseInit();

const runScript = async (): Promise<void> => {
  try {
    const adminRoleId = await Role.create({
      name: "ADMIN",
    });
    await Role.create({
      name: "EDITOR",
    });
    await Role.create({
      name: "VIEWER",
    });

    await User.create({
      email: "admin@example.com",
      isBlocked: false,
      password: await generateHashPassword("12345"),
      roles: [adminRoleId._id],
    });
    console.log("Admin role created");

    // Close database connection
    await mongoose.disconnect();
    console.log("Database connection closed");

    // Exit the process
    process.exit(0);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

void runScript();
