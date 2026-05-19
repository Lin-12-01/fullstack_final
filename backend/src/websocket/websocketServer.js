const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const clients = new Map();

const getOnlineUsersList = async () => {
  const online = await User.find({ isOnline: true }).select('name email avatarUrl _id');
  return online;
};

const broadcast = (wss, data, targetUserIds = null) => {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState !== 1) return;
    if (targetUserIds && client.userId && !targetUserIds.includes(client.userId)) {
      return;
    }
    client.send(payload);
  });
};

const broadcastOnlineUsers = async (wss) => {
  const onlineUsers = await getOnlineUsersList();
  broadcast(wss, { type: 'online:users', onlineUsers });
};

const initWebSocket = (server, app) => {
  const wss = new WebSocketServer({ server, path: '/ws' });

  app.locals.wsBroadcast = (event) => {
    const { type, task, projectId, memberIds } = event;
    const message = {
      type: type || 'notification',
      task,
      projectId,
      message: getNotificationMessage(type, task),
      timestamp: new Date().toISOString(),
    };
    broadcast(wss, message, memberIds);
  };

  wss.on('connection', async (ws, req) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get('token');

      if (!token) {
        ws.close(4001, 'Unauthorized');
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        ws.close(4001, 'Unauthorized');
        return;
      }

      ws.userId = user._id.toString();
      clients.set(ws.userId, ws);

      user.isOnline = true;
      user.lastSeen = new Date();
      await user.save();

      await broadcastOnlineUsers(wss);

      ws.on('message', (raw) => {
        try {
          const data = JSON.parse(raw.toString());
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch {
          /* ignore invalid messages */
        }
      });

      ws.on('close', async () => {
        clients.delete(ws.userId);
        const u = await User.findById(ws.userId);
        if (u) {
          u.isOnline = false;
          u.lastSeen = new Date();
          await u.save();
        }
        await broadcastOnlineUsers(wss);
      });
    } catch {
      ws.close(4001, 'Unauthorized');
    }
  });

  return wss;
};

const getNotificationMessage = (type, task) => {
  if (!task) return 'Update received';
  switch (type) {
    case 'task:created':
      return `New task created: ${task.title}`;
    case 'task:updated':
      return `Task updated: ${task.title}`;
    case 'task:deleted':
      return 'A task was deleted';
    case 'notification:task-assigned':
      return `You were assigned to task: ${task.title}`;
    default:
      return `Task update: ${task.title}`;
  }
};

module.exports = { initWebSocket, broadcastOnlineUsers };
