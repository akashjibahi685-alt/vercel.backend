const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const prisma = new PrismaClient();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get profile details for a user (including achievements & papers)
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        memberProfile: true,
        achievements: { orderBy: { dateEarned: 'desc' } },
        researchPapers: { orderBy: { publishedDate: 'desc' } },
        certificates: { orderBy: { issueDate: 'desc' } },
        internships: { orderBy: { startDate: 'desc' } }
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Add an achievement
router.post('/:id/achievements', async (req, res) => {
  try {
    const achievement = await prisma.achievement.create({
      data: {
        userId: req.params.id,
        title: req.body.title,
        description: req.body.description,
        badgeUrl: req.body.badgeUrl,
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.params.id,
        action: 'Added Achievement',
        target: req.body.title,
        type: 'achievement'
      }
    });

    res.json(achievement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add achievement' });
  }
});

// Post a research paper
router.post('/:id/papers', async (req, res) => {
  try {
    const paper = await prisma.researchPaper.create({
      data: {
        userId: req.params.id,
        title: req.body.title,
        abstract: req.body.abstract,
        pdfUrl: req.body.pdfUrl,
        tags: req.body.tags ? JSON.stringify(req.body.tags) : null,
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.params.id,
        action: 'Published Research Paper',
        target: req.body.title,
        type: 'research_paper'
      }
    });

    res.json(paper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to post research paper' });
  }
});

// Add a certificate
router.post('/:id/certificates', async (req, res) => {
  try {
    const certificate = await prisma.certificate.create({
      data: {
        userId: req.params.id,
        title: req.body.title,
        issuer: req.body.issuer,
        issueDate: req.body.issueDate ? new Date(req.body.issueDate) : undefined,
        certificateUrl: req.body.certificateUrl,
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.params.id,
        action: 'Added Certificate',
        target: req.body.title,
        type: 'certificate'
      }
    });

    res.json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add certificate' });
  }
});

// Add an internship
router.post('/:id/internships', async (req, res) => {
  try {
    const internship = await prisma.internship.create({
      data: {
        userId: req.params.id,
        company: req.body.company,
        role: req.body.role,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
        description: req.body.description,
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.params.id,
        action: 'Logged Internship',
        target: `${req.body.role} at ${req.body.company}`,
        type: 'internship'
      }
    });

    res.json(internship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add internship' });
  }
});

// Update profile avatar
router.put('/:id/avatar', async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { avatarUrl }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.params.id,
        action: 'Updated Profile Picture',
        type: 'profile'
      }
    });

    res.json({ success: true, avatarUrl: user.avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

// Upload profile picture directly (FormData)
router.post('/:id/avatar/upload', upload.single('avatarFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the public URL for the file
    // Assumes backend is running on the current host, but since we use a relative path it will load from backend API
    const avatarUrl = `http://localhost:3001/uploads/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { avatarUrl }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.params.id,
        action: 'Uploaded Profile Picture',
        type: 'profile'
      }
    });

    res.json({ success: true, avatarUrl: user.avatarUrl });
  } catch (error) {
    console.error('File upload error', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

module.exports = router;
