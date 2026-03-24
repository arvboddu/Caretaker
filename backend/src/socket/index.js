const jwt = require('jsonwebtoken');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('authenticate', async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        socket.userRole = decoded.role;
        
        socket.join(`user:${decoded.userId}`);
        
        socket.emit('authenticated', { userId: decoded.userId });
        console.log('User authenticated:', decoded.userId);
      } catch (error) {
        socket.emit('auth_error', { message: 'Invalid token' });
        socket.disconnect();
      }
    });

    socket.on('join_thread', (threadId) => {
      if (socket.userId) {
        socket.join(`chat:${threadId}`);
        console.log(`User ${socket.userId} joined thread ${threadId}`);
      }
    });

    socket.on('leave_thread', (threadId) => {
      socket.leave(`chat:${threadId}`);
    });

    socket.on('typing', ({ threadId, isTyping }) => {
      if (socket.userId) {
        socket.to(`chat:${threadId}`).emit('user_typing', {
          userId: socket.userId,
          isTyping
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
