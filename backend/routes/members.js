const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

function formatMember(m) {
  return {
    ...m,
    skills: (m.skills || []).map(s => s.skill)
  };
}

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      include: { skills: true },
      orderBy: { joinedDate: 'desc' }
    });
    res.json(members.map(formatMember));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get member analytics/rankings
router.get('/analytics', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      where: { role: 'Member' },
      include: {
        user: {
          select: {
            _count: {
              select: {
                achievements: true,
                researchPapers: true,
                internships: true,
                certificates: true
              }
            }
          }
        }
      }
    });

    // Map and calculate total score
    const analyticsData = members.map(member => {
      const counts = member.user?._count || { achievements: 0, researchPapers: 0, internships: 0, certificates: 0 };
      const totalScore = 
        (counts.achievements * 10) + 
        (counts.researchPapers * 20) + 
        (counts.internships * 15) + 
        (counts.certificates * 15);

      return {
        id: member.id,
        name: member.name,
        department: member.department,
        avatarUrl: member.avatarUrl,
        achievements: counts.achievements,
        papers: counts.researchPapers,
        internships: counts.internships,
        certificates: counts.certificates,
        totalScore
      };
    });

    res.json(analyticsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Create member
router.post('/', async (req, res) => {
  try {
    const { name, email, role, status, department, githubUrl, avatarUrl, skills } = req.body;
    
    const member = await prisma.member.create({
      data: {
        name,
        email,
        role: role || 'Member',
        status: status || 'Active',
        department,
        githubUrl,
        avatarUrl,
        skills: {
          create: (skills || []).map(s => ({ skill: s }))
        }
      },
      include: { skills: true }
    });
    
    res.json({ success: true, member: formatMember(member) });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ success: false, error: 'Failed to create member' });
  }
});

// Update member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, department, githubUrl, avatarUrl, skills } = req.body;
    
    // Delete existing skills first
    await prisma.memberSkill.deleteMany({ where: { memberId: id } });
    
    const member = await prisma.member.update({
      where: { id },
      data: {
        name,
        email,
        role,
        status,
        department,
        githubUrl,
        avatarUrl,
        skills: {
          create: (skills || []).map(s => ({ skill: s }))
        }
      },
      include: { skills: true }
    });
    
    res.json({ success: true, member: formatMember(member) });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ success: false, error: 'Failed to update member' });
  }
});

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.member.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ success: false, error: 'Failed to delete member' });
  }
});

module.exports = router;
