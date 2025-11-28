const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Message = require('../models/Message');


// GET /api/chat/messages?userId=otherUserId&limit=50&page=1
// If userId is provided, fetch private messages between current user and userId. Otherwise, fetch group messages.
router.get('/messages', authenticateToken, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const otherUserId = req.query.userId;

  let filter = {};
  if (otherUserId) {
    // Private chat: messages where (sender==me && recipient==other) OR (sender==other && recipient==me)
    filter = {
      $or: [
        { sender: req.user.id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.id },
      ],
    };
  } else {
    // Group chat: messages with no recipient
    filter = { recipient: { $exists: false } };
  }

  try {
    const messages = await Message.find(filter)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    res.json({ page, limit, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/chat/messages (body: { text, recipientId, recipientName })
router.post('/messages', authenticateToken, async (req, res) => {
  const { text, recipientId, recipientName } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ message: 'Message text is required' });
  }

  try {
    const msg = new Message({
      sender: req.user.id,
      senderName: req.user.username || 'Unknown',
      recipient: recipientId || undefined,
      recipientName: recipientName || undefined,
      text: text.trim(),
    });

    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
