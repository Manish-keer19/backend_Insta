import express, { Request, Response } from "express";
import { connectDb } from "./config/connectDb";
import userRoute from "./router/user.route";
import profileRoute from "./router/Profile.route";
import cors from "cors"; // Import CORS package
import dotenv from "dotenv";
import authRoute from "./router/auth.route";
import fileUpload from "express-fileupload";
import Postroute from "./router/post.route";
import likeRoute from "./router/Like.route";
import commentRoute from "./router/comment.route";
import storyRoute from "./router/story.route";
import messageRoute from "./router/message.route";

dotenv.config(); // Load environment variables from .env file

import "./cronJobs/storyCleanup";

// Create an instance of the Express application
const app = express();

// Connect to the database
connectDb();

// Enable CORS for all origins
app.use(cors()); // Allow requests from any origin

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// Middleware to parse JSON requests
app.use(express.json());

// Set up routes
app.use("/api/v1/user", userRoute); // User routes
app.use("/api/v1/profile", profileRoute); // Profile routes
app.use("/api/v1/auth", authRoute); // Auth routes
app.use("/api/v1/post", Postroute); // Post routes
app.use("/api/v1/like", likeRoute); // Like routes
app.use("/api/v1/comment", commentRoute); // comment routes
app.use("/api/v1/story", storyRoute); // comment routes
app.use("/api/v1/message", messageRoute); // Message routes

// Basic root route
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

app.get("/", (req: Request, res: Response) => {
  res.send(`
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Instagramclone Backend</title>
    <link
      rel="icon"
      href="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
      type="image/png"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
      rel="stylesheet"
    />
    <style>
      .icon {
        width: 24px;
        height: 24px;
      }
    </style>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      rel="stylesheet"
    />
  </head>
  <body
    class="bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white"
  >
    <div class="min-h-screen p-4 sm:p-6 md:p-8">
      <div class="container mx-auto max-w-6xl">
        <!-- Hero Section -->
        <div class="text-center mb-12 sm:mb-16">
          <h1
            class="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Manish's Instagram Clone Backend
          </h1>
          <p class="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            A fully functional Instagram-inspired mobile app featuring real-time
            chat, media sharing, and secure authentication.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <!-- Feature 1 -->
          <div
            class="bg-opacity-20 backdrop-blur-xl bg-gray-900 rounded-2xl p-6 border border-opacity-30 border-purple-500 hover:border-opacity-50 transition-all duration-300"
          >
            <div
              class="bg-purple-500 bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto"
            >
              <i class="fas fa-comments icon"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Real-time Chat</h3>
            <p class="text-gray-400">
              Connect with users instantly through our real-time messaging
              system powered by WebSocket.
            </p>
          </div>
          <!-- Feature 2 -->
          <div
            class="bg-opacity-20 backdrop-blur-xl bg-gray-900 rounded-2xl p-6 border border-opacity-30 border-purple-500 hover:border-opacity-50 transition-all duration-300"
          >
            <div
              class="bg-purple-500 bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto"
            >
              <i class="fas fa-camera-retro icon"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Post Media</h3>
            <p class="text-gray-400">
              Seamlessly upload and share images and videos on your profile.
            </p>
          </div>
          <!-- Feature 3 -->
          <div
            class="bg-opacity-20 backdrop-blur-xl bg-gray-900 rounded-2xl p-6 border border-opacity-30 border-purple-500 hover:border-opacity-50 transition-all duration-300"
          >
            <div
              class="bg-purple-500 bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto"
            >
              <i  class="fas fa-thumbs-up icon "></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Likes & Comments</h3>
            <p class="text-gray-400">
              Engage with posts by liking and commenting on them in real-time.
            </p>
          </div>
          <!-- Feature 4 -->
          <div
            class="bg-opacity-20 backdrop-blur-xl bg-gray-900 rounded-2xl p-6 border border-opacity-30 border-purple-500 hover:border-opacity-50 transition-all duration-300"
          >
            <div
              class="bg-purple-500 bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto"
            >
              <i class="fas fa-user-circle icon"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Profile Management</h3>
            <p class="text-gray-400">
              Customize your profile, upload profile pictures, and manage
              personal information.
            </p>
          </div>
        </div>

        <!-- Creator Section -->
        <div
          class="bg-opacity-20 backdrop-blur-xl bg-gray-900 rounded-2xl p-6 sm:p-8 border border-opacity-30 border-purple-500 mb-8"
        >
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <img
              src="https://avatars.githubusercontent.com/u/147429908?s=400&u=b1b05db8a7e03ca4de06f8996e5d0ac2254a9bc9&v=4"
              alt="Manish Keer"
              class="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
            />
            <div>
              <h2 class="text-2xl sm:text-3xl font-bold mb-2">
                Created by Manish Keer
              </h2>
              <p class="text-gray-400 mb-4">
                Full-stack developer passionate about creating beautiful and
                functional applications.
              </p>
              <div class="flex gap-4 justify-center">
                <a
                  href="https://github.com/Manish-keer19/Full_Stack-InstaClone-apk"
                  target="_blank"
                  class="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <i class="fab fa-github icon"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/manish-keer-93a212247/"
                  target="_blank"
                  class="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <i class="fab fa-linkedin icon"></i>
                </a>
                <a
                  href="https://www.instagram.com/manish_keer19/"
                  target="_blank"
                  class="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <i class="fab fa-instagram icon"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Technologies Used -->
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4">
            Built with Modern Technologies
          </h2>
          <div class="flex flex-wrap justify-center gap-4">
            <span
              class="px-4 py-2 bg-purple-500 bg-opacity-20 rounded-full text-sm"
              >TypeScript</span
            >
            <span
              class="px-4 py-2 bg-purple-500 bg-opacity-20 rounded-full text-sm"
              >Tailwind CSS</span
            >
            <span
              class="px-4 py-2 bg-purple-500 bg-opacity-20 rounded-full text-sm"
              >WebSocket</span
            >
            <span
              class="px-4 py-2 bg-purple-500 bg-opacity-20 rounded-full text-sm"
              >Node.js</span
            >
            <span
              class="px-4 py-2 bg-purple-500 bg-opacity-20 rounded-full text-sm"
              >React Native</span
            >
            <span
              class="px-4 py-2 bg-purple-500 bg-opacity-20 rounded-full text-sm"
              >MongoDB</span
            >
            <span
              class="px-4 py-2 bg-purple-500 bg-opacity-20 rounded-full text-sm"
              >React-Native Navigation</span
            >
            <span
              class="px-4 py-2 bg-purple-500 bg-opacity-20 rounded-full text-sm"
              >Jwt</span
            >
          </div>
        </div>
      </div>
    </div>
  </body>
</html>

  `)
});
// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app; // Export the app instance
