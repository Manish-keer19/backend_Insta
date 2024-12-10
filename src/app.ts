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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Manish's Instagram Backend</title>
      <style>
        body {
          background-color: #212121;
          color: #ffffff;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          overflow: hidden;
        }
        .welcome {
          text-align: center;
          animation: fadeIn 3s ease-in-out infinite;
        }
        @keyframes fadeIn {
          0%, 100% {
            opacity: 0;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        h1 {
          font-size: 3rem;
          margin: 0;
          animation: textGlow 2s ease-in-out infinite;
        }
        @keyframes textGlow {
          0% {
            text-shadow: 0 0 5px #ffffff, 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000;
          }
          25% {
            text-shadow: 0 0 5px #ffffff, 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
          }
          50% {
            text-shadow: 0 0 5px #ffffff, 0 0 10px #0000ff, 0 0 20px #0000ff, 0 0 30px #0000ff;
          }
          75% {
            text-shadow: 0 0 5px #ffffff, 0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00;
          }
          100% {
            text-shadow: 0 0 5px #ffffff, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff;
          }
        }
        p {
          font-size: 1.2rem;
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="welcome">
        <h1>Welcome to Manish's Instagram Backend!</h1>
        <p>The server is running on port 3000 🚀</p>
      </div>
    </body>
    </html>
  `);
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
