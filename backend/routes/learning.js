const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Add Domain
router.post('/domains', async (req, res) => {
  try {
    const { name, badgeColor, accentColor, level, description, sortOrder } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const domain = await prisma.learningDomain.create({
      data: {
        name,
        slug,
        badgeColor,
        accentColor,
        level,
        description,
        sortOrder: parseInt(sortOrder) || 0
      }
    });
    res.json({ success: true, domain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create learning domain' });
  }
});

// Update Domain
router.put('/domains/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, badgeColor, accentColor, level, description, sortOrder } = req.body;
    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined;
    const domain = await prisma.learningDomain.update({
      where: { id },
      data: {
        name,
        slug,
        badgeColor,
        accentColor,
        level,
        description,
        sortOrder: sortOrder ? parseInt(sortOrder) : undefined
      }
    });
    res.json({ success: true, domain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update learning domain' });
  }
});

// Delete Domain
router.delete('/domains/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.learningDomain.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete learning domain' });
  }
});

// Add Resource
router.post('/resources', async (req, res) => {
  try {
    const { domainId, title, type, format, duration, instructor, videoUrl, githubUrl, notesPdfUrl, colabUrl, description, isFeatured } = req.body;
    const resource = await prisma.learningResource.create({
      data: {
        domainId,
        title,
        type,
        format,
        duration,
        instructor,
        videoUrl,
        githubUrl,
        notesPdfUrl,
        colabUrl,
        description,
        isFeatured: !!isFeatured
      }
    });
    res.json({ success: true, resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create learning resource' });
  }
});

// Update Resource
router.put('/resources/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { domainId, title, type, format, duration, instructor, videoUrl, githubUrl, notesPdfUrl, colabUrl, description, isFeatured } = req.body;
    const resource = await prisma.learningResource.update({
      where: { id },
      data: {
        domainId,
        title,
        type,
        format,
        duration,
        instructor,
        videoUrl,
        githubUrl,
        notesPdfUrl,
        colabUrl,
        description,
        isFeatured: isFeatured !== undefined ? !!isFeatured : undefined
      }
    });
    res.json({ success: true, resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update learning resource' });
  }
});

// Delete Resource
router.delete('/resources/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.learningResource.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete learning resource' });
  }
});

module.exports = router;
