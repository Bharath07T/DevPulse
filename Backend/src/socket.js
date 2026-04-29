import { Server } from "socket.io";

let io;

export const initSocket = (httpServer, clientUrl) => {
    io = new Server(httpServer, {
        cors : { origin : clientUrl }
    });

    io.on("connection", (socket) => {
        socket.on("join-room", (reviewId) => {
            socket.reviewId = reviewId;
            socket.join(reviewId);
            io.to(reviewId).emit("user-joined", { id : socket.id });
        });

        socket.on("new-comment", (data) => {
            io.to(socket.reviewId).emit("comment-added", data);
        });

        socket.on("leave-room", (reviewId) => {
            socket.leave(reviewId);
        });

        socket.on("disconnect", () => {
            if(socket.reviewId){
                io.to(socket.reviewId).emit("user-left", { id : socket.id });
            }
        });
    });

    return io;
}

export const getIO = () => {
    if(!io){
        throw new Error("Socket.io not initialized");
    }

    return io;
}