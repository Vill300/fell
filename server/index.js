const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const supabase = require('./supabase');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5175",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Test Supabase connection
supabase.from('users').select('*').limit(1).then(() => {
  console.log('Supabase connected');
}).catch(err => console.log('Supabase connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/messages', require('./routes/messages'));

// Make io accessible in routes
app.set('io', io);

// Basic route
app.get('/', (req, res) => {
  res.send('Discord Clone Server');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user's room for private messages
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});