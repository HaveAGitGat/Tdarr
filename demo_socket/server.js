// Simple demo server mimicking Tdarr's socket.io setup
const Fastify = require('fastify');
const ioS = require('socket.io');
const path = require('path');

// Fastify options (matching Tdarr's setup)
const fOpts = {
  logger: true,
  bodyLimit: 50 * 1024 * 1024,
};

const fastify = Fastify(fOpts);

// Serve static files (the HTML page)
fastify.register(require('@fastify/static'), {
  root: __dirname,
  prefix: '/',
});

// Socket.io setup (matching Tdarr's configuration)
const io = ioS(fastify.server, {
  pingTimeout: 60000,  // Increase ping timeout to 60 seconds from 20
  pingInterval: 25000,
  connectTimeout: 60000, // Increase connection timeout to 60 seconds from 45
  upgradeTimeout: 30000, // Increase upgrade timeout to 30 seconds from 10
});

// Setup /webui namespace (Tdarr uses this)
const webuiNamespace = io.of('/webui');

webuiNamespace.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  console.log('   Transport:', socket.conn.transport.name);
  console.log('   Auth headers:', socket.handshake.headers.authorization || 'none');

  // Send initial sync message
  socket.emit('syncMessage', {
    message: 'Connected to demo server',
    timestamp: new Date().toISOString()
  });

  // Handle ping requests from client
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: Date.now() });
  });

  // Simulate Tdarr's sync events
  const syncInterval = setInterval(() => {
    socket.emit('syncServerTime', Date.now());
  }, 1000);

  socket.on('disconnect', (reason) => {
    console.log('❌ Client disconnected:', socket.id, 'Reason:', reason);
    clearInterval(syncInterval);
  });

  socket.on('error', (err) => {
    console.error('🔥 Socket error:', err);
  });
});

// Monitor transport upgrades
io.engine.on('connection_error', (err) => {
  console.error('🔥 Connection error:', err);
});

// Start the server
const PORT = 5266;
const HOST = 'localhost';  // Bind to all interfaces instead of just localhost

fastify.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          Tdarr Socket.io Demo Server                      ║
╟────────────────────────────────────────────────────────────╢
║  Server running at: ${address}                    ║
║  Open in browser:   http://localhost:${PORT}              ║
║                                                            ║
║  Socket.io namespace: /webui                               ║
║  Socket.io path:      /socket.io                           ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await fastify.close();
  process.exit(0);
});
