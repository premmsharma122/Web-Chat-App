// import express from "express"
// import "dotenv/config"
// import cors from "cors"
// import http from "http"
// import { connectDB } from "./lib/db.js";
// import userRouter from "./routes/userRoutes.js";
// import messageRouter from "./routes/messageRoutes.js";
// import { Server } from "socket.io"

// const app = express();
// const server = http.createServer(app)

// export const io = new Server(server,{
//     cors: {origin: "*"}
// })

// export const userSocketMap = {};
// io.on("connection", (socket)=>{
//     const userId = socket.handshake.query.userId;
//     console.log("User Connected", userId);

//     if(userId) userSocketMap[userId] = socket.id;
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
//     socket.on("disconnect", ()=>{
//         console.log("User Disconnected", userId);
//         io.emit("getOnlineUsers", Object.keys(userSocketMap));
        
//     })
// })


// app.use(express.json({limit : '4mb'}));
// app.use(cors())

// app.use("/api/status",(req,res)=> res.send("Server is live"));
// app.use("/api/auth", userRouter);
// app.use("/api/messages", messageRouter)


// await connectDB();

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, ()=>console.log("Server is running on port:"+PORT));

// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import http from "http";
// import { connectDB } from "./lib/db.js";
// import userRouter from "./routes/userRoutes.js";
// import messageRouter from "./routes/messageRoutes.js";
// import { Server } from "socket.io";

// const app = express();
// const server = http.createServer(app);

// // SOCKET.IO
// export const io = new Server(server, {
//     cors: { origin: "*" } // For production, replace "*" with your frontend URL
// });

// export const userSocketMap = {};
// export const socketUserMap = {};

// io.on("connection", (socket) => {
//     const userId = socket.handshake.query.userId;
//     console.log("User Connected:", userId);

//     if (userId) {
//         userSocketMap[userId] = socket.id;
//         socketUserMap[socket.id] = userId;
//     }

//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     socket.on("disconnect", () => {
//         const disconnectedUser = socketUserMap[socket.id];
//         if (disconnectedUser) delete userSocketMap[disconnectedUser];
//         delete socketUserMap[socket.id];

//         console.log("User Disconnected:", disconnectedUser);
//         io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });
// });

// // MIDDLEWARE
// app.use(express.json({ limit: "4mb" }));
// app.use(cors()); // For production, restrict origin

// // ROUTES
// app.use("/api/status", (req, res) => res.send("Server is live"));
// app.use("/api/users", userRouter); // ✅ Mount under /api/users
// app.use("/api/messages", messageRouter);

// // CONNECT DB AND START SERVER
// if(process.env.NODE_ENV !== "production") {
// try {
//     await connectDB();
//     const PORT = process.env.PORT || 5000;
//     server.listen(PORT, () => console.log("Server running on port:", PORT));
// } catch (err) {
//     console.error("Failed to connect to DB", err);
//     process.exit(1);
// }
// }
// export default server;
import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// SOCKET.IO
export const io = new Server(server, {
    cors: { origin: "*" }
});

export const userSocketMap = {};
export const socketUserMap = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected:", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
        socketUserMap[socket.id] = userId;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        const disconnectedUser = socketUserMap[socket.id];
        if (disconnectedUser) delete userSocketMap[disconnectedUser];
        delete socketUserMap[socket.id];

        console.log("User Disconnected:", disconnectedUser);
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// MIDDLEWARE
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// ROUTES
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

// CONNECT DB AND START SERVER
connectDB();
export default server;