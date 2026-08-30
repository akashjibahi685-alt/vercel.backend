const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedDate: 'desc' }
    });
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blog posts' });
  }
});

// Create a blog post
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        authorId: data.authorId,
        authorName: data.authorName,
        category: data.category,
        readTime: data.readTime,
        status: data.status || 'Published',
        coverImageUrl: data.coverImageUrl,
        excerpt: data.excerpt,
        content: data.content
      }
    });
    res.json({ success: true, post });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to create blog post' });
  }
});

// Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const post = await prisma.blogPost.update({
      where: { id },
      data
    });
    res.json({ success: true, post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to update blog post' });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.blogPost.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blog post' });
  }
});

module.exports = router;
