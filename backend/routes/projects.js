const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const rawProjects = await prisma.project.findMany({
      include: { authors: true },
      orderBy: { createdAt: 'desc' }
    });
    
    const projects = rawProjects.map(p => ({
      ...p,
      image: p.imageUrl || null,
      github: p.githubUrl || null,
      authors: (p.authors || []).map(a => a.authorName || 'Unknown').filter(Boolean)
    }));

    res.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

// Create a project
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const project = await prisma.project.create({
      data: {
        name: data.name,
        category: data.category,
        status: data.status || 'Approved',
        githubUrl: data.github,
        demoUrl: data.demoUrl,
        imageUrl: data.image,
        description: data.description,
        createdById: data.createdById,
        // Assuming we map string authors to ProjectAuthor relation later if needed
      }
    });
    res.json({ success: true, project: { ...project, image: project.imageUrl, github: project.githubUrl, authors: [] } });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, error: 'Failed to create project' });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Only extract valid fields for prisma update
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.github !== undefined) updateData.githubUrl = data.github;
    if (data.demoUrl !== undefined) updateData.demoUrl = data.demoUrl;
    if (data.image !== undefined) updateData.imageUrl = data.image;
    if (data.description !== undefined) updateData.description = data.description;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: { authors: true }
    });
    
    res.json({ 
      success: true, 
      project: {
        ...project,
        image: project.imageUrl,
        github: project.githubUrl,
        authors: (project.authors || []).map(a => a.authorName).filter(Boolean)
      } 
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, error: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
});

module.exports = router;
