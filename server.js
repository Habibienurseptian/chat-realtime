const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Riwayat chat sementara di memori — hilang saat server restart.
// Untuk persisten, ganti dengan database (lihat catatan di akhir).
const messages = [];

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));
  const io = new Server(httpServer, { path: "/api/socket" });

  io.on("connection", (socket) => {
    socket.emit("history", messages.slice(-50));

    socket.on("message", (msg) => {
      const fullMessage = {
        ...msg,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };
      messages.push(fullMessage);
      io.emit("message", fullMessage);
    });
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`> Server ready on http://localhost:${port}`);
  });
});