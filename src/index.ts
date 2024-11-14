// import app from "./app"; // Import the app instance
// import dotenv from "dotenv";

// // Load environment variables from .env file
// dotenv.config();

// const port = process.env.PORT || 3000; // Set the port, default to 3000

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { initializeSocket } from "./socket/socket";
import dotenv from "dotenv";
import { initializeCallerSocket } from "./socket/caller";

dotenv.config();

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from any origin for development
  },
});

initializeSocket(io);
// initializeCallerSocket(io);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
