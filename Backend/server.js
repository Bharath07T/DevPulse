import app from "./src/app.js";
import env from './src/config/env.js';
import connectDB from './src/config/dbConnection.js';
import { createServer } from 'http';
import { initSocket } from "./src/socket.js";

connectDB();

// app.listen(env.port, () => {
//     console.log(`Server is running on PORT ${env.port}`);
// });

const httpServer = createServer(app);
// export const io = new Server(httpServer, {
//     cors : {origin : env.clientUrl}
// });

// io.on("connection", (socket) => {
//     socket.on("join-room", (reviewId) => {
//         socket.reviewId = reviewId;
//         socket.join(reviewId);
//         io.to(reviewId).emit("user-joined", { id : socket.id });
//     });

//     socket.on("new-comment", (data) => {
//         io.to(socket.reviewId).emit("comment-added", data);
//     });

//     socket.on("ai-review-done", (data) => {
//         io.to(socket.reviewId).emit("ai-review-updated", data);
//     })

//     socket.on("leave-room", (reviewId) => {
//         socket.leave(reviewId);
//     });

//     socket.on("disconnect", () => {
//         if(socket.reviewId){
//             io.to(socket.reviewId).emit("user-left", { id : socket.id });
//         }
//     })
// });

initSocket(httpServer, env.clientUrl);

httpServer.listen(env.port, () => {
    console.log(`Server is running on PORT ${env.port}`);
});
