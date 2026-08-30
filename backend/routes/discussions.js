const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all discussion threads
router.get('/', async (req, res) => {
  try {
    const threads = await prisma.discussionThread.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        author: { select: { name: true, avatarUrl: true, role: true } },
        replies: { include: { author: { select: { name: true, avatarUrl: true } } } }
      }
    });
    res.json(threads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
});

// Create a new discussion thread
router.post('/', async (req, res) => {
  try {
    const thread = await prisma.discussionThread.create({
      data: {
        authorId: req.body.authorId,
        title: req.body.title,
        content: req.body.content,
        type: req.body.type || 'General'
      },
      include: {
        author: { select: { name: true, avatarUrl: true, role: true } },
        replies: true
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.body.authorId,
        action: 'Created Discussion Thread',
        target: req.body.title,
        type: 'forum'
      }
    }).catch(console.error);

    res.json(thread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create discussion thread' });
  }
});

// Post a reply
router.post('/:id/replies', async (req, res) => {
  try {
    const reply = await prisma.discussionReply.create({
      data: {
        threadId: req.params.id,
        authorId: req.body.authorId,
        content: req.body.content
      },
      include: {
        author: { select: { name: true, avatarUrl: true } }
      }
    });
    
    // Update thread updatedAt to bubble it up
    await prisma.discussionThread.update({
      where: { id: req.params.id },
      data: { updatedAt: new Date() }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.body.authorId,
        action: 'Replied to Thread',
        target: `Thread ID: ${req.params.id}`,
        type: 'forum'
      }
    }).catch(console.error);

    res.json(reply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to post reply' });
  }
});

module.exports = router;
