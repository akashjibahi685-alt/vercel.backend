const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, resources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch resources' });
  }
});

// Create a resource
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        type: data.type,
        size: data.size,
        domain: data.domain,
        linkUrl: data.linkUrl,
        downloads: 0,
        createdById: data.createdById
      }
    });
    res.json({ success: true, resource });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ success: false, error: 'Failed to create resource' });
  }
});

// Update a resource
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const resource = await prisma.resource.update({
      where: { id },
      data
    });
    res.json({ success: true, resource });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ success: false, error: 'Failed to update resource' });
  }
});

// Delete a resource
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.resource.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ success: false, error: 'Failed to delete resource' });
  }
});

module.exports = router;
