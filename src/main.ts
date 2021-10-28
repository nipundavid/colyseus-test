import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import { MyRoom } from "./room/MyRoom";

const app = express();
const port = Number(process.env.PORT || 3553);

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
  server: server,
});

gameServer.define("myRoom", MyRoom);
gameServer.listen(port);

console.log(`Listening on ws://localhost:${port}`);
