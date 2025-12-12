const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get friends list
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'username avatar status');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send friend request
router.post('/add/:username', auth, async (req, res) => {
  try {
    const { username } = req.params;
    const friend = await User.findOne({ username });

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (friend._id.equals(req.user._id)) {
      return res.status(400).json({ message: 'Cannot add yourself' });
    }

    if (req.user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // For simplicity, directly add as friend (no request system)
    req.user.friends.push(friend._id);
    await req.user.save();

    friend.friends.push(req.user._id);
    await friend.save();

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove friend
router.delete('/:friendId', auth, async (req, res) => {
  try {
    const { friendId } = req.params;

    req.user.friends = req.user.friends.filter(id => !id.equals(friendId));
    await req.user.save();

    const friend = await User.findById(friendId);
    if (friend) {
      friend.friends = friend.friends.filter(id => !id.equals(req.user._id));
      await friend.save();
    }

    res.json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;