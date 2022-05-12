require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const authRouter = require("./router/auth");
const gameRouter = require("./router/game");
const errorMiddleware = require("./middlewares/errorMiddleware");

const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    path: "/sockets/",
    cors: {
        origin: process.env.CLIENT_URL,
    },
});

ioController(io);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use("/api", authRouter);
app.use("/api/game", gameRouter);
app.use(errorMiddleware);

(async function start() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        httpServer.listen(PORT, () =>
            console.log(`Dev server started on port ${PORT}`)
        );
    } catch (error) {
        console.log(error);
    }
})();

function ioController(io) {
    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId;

        if (!userId) {
            next(new Error("invalid userId"));
        }

        socket.data.userId = userId;
        next();
    });

    io.on("connection", (socket) => {
        console.log("connection", socket);
    });
}
