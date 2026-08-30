const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Add Notification
router.post('/', async (req, res) => {
  try {
    const { title, message, audience, channel, sentById } = req.body;
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        audience,
        channel,
        sentById,
        deliveryRate: 100.0
      }
    });
    res.json({ success: true, notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create notification' });
  }
});

// Delete Notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete notification' });
  }
});

module.exports = router;
