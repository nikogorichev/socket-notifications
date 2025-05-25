import { Server } from "mock-socket";

export const setupMockServer = () => {
  const server = new Server("ws://localhost:1234");

  server.on("connection", (socket) => {
    console.log("[MOCK WS] Connected");

    let counter = 1;

    const interval = setInterval(() => {
      const message = JSON.stringify({
        id: counter,
        message: `Mock message #${counter}`,
        timestamp: new Date().toISOString(),
      });
      socket.send(message);
      counter++;
    }, 1000);

    setTimeout(() => {
      console.log("[MOCK WS] Closing connection...");
      socket.close();
    }, 8000);

    socket.on("message", (data) => {
      console.log("[MOCK WS] Received from client:", data);
    });

    socket.on("close", () => {
      console.log("[MOCK WS] Client disconnected");
      clearInterval(interval);
    });
  });
};
