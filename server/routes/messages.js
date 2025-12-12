const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get messages with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'username avatar')
    .populate('receiver', 'username avatar')
    .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { content } = req.body;

    const message = new Message({
      sender: req.user._id,
      receiver: userId,
      content
    });

    await message.save();
    await message.populate('sender', 'username avatar');

    // Emit to receiver via socket.io (if online)
    const io = req.app.get('io');
    io.to(userId).emit('newMessage', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/read/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;