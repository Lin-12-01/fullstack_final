require('dotenv').config();
const http = require('http');
const createApp = require('./app');
const connectDB = require('./config/db');
const { initWebSocket } = require('./websocket/websocketServer');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const app = createApp();
    const server = http.createServer(app);
    initWebSocket(server, app);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { startServer, createApp };
