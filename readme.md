### User-Generated Content Management System

This Node.js application allows users to publish their content online, manage posts, and apply CRUD operations with pagination. It enforces a strong schema, supports tagging, implements a role-based system, and restricts post creation before a certain time.

#### Deployment Instructions

To deploy the application, follow these steps:

1. **Clone the Repository**

   ```
   git clone <repository-url>
   ```

2. **Install Dependencies**

   ```
   cd <repository-folder>
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=3000
   DATABASE_URL=<your-database-url>
   SECRET_KEY=<your-secret-key>
   ```

4. **Seed Admin User**

   Seed the database with an admin user:

   ```
   npm run seed
   ```

5. **Start the Server**

   ```
   npm start
   ```

6. **Access the Application**

   Open a web browser and navigate to `http://localhost:8000` to access the application.

#### Seeder Script

The seeder script seeds the database with an admin user. Below is the pseudocode for the seeder script:

```typescript
// seeder/index.ts
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

```

#### Additional Notes

- Ensure that your database is properly configured and accessible.
- Customize the application according to your specific requirements or preferences.
- Refer to the API documentation or code comments for more detailed information about each endpoint and functionality.

Feel free to reach out if you have any questions or need further assistance. Happy coding!






#!/bin/bash

# Update package lists
sudo apt-get update

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Install Nginx
sudo apt-get install -y nginx

# Clone your Node.js application repository
git clone <repository-url>
cd <repository-folder>

# Install application dependencies
npm install

# Set up environment variables
echo "PORT=3000" >> .env
echo "DATABASE_URL=<your-database-url>" >> .env
echo "SECRET_KEY=<your-secret-key>" >> .env

# Seed admin user
npm run seed

# Configure Nginx
sudo rm /etc/nginx/sites-enabled/default
sudo touch /etc/nginx/sites-available/myapp
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp

# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/myapp

# Add the following configuration (replace placeholders with actual values):
#
# server {
#     listen 80;
#     server_name your-domain.com;
#
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_cache_bypass $http_upgrade;
#     }
# }

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Start Node.js application using a process manager like PM2
sudo npm install -g pm2
pm2 start <entry-file> --name myapp

# Enable PM2 to start on system boot
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u <user> --hp /home/<user>

# Save current PM2 process list
pm2 save

# Display status of PM2 processes
pm2 status

# Display log output of your application
pm2 logs myapp
