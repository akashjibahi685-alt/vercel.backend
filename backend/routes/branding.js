const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Update branding settings
router.put('/', async (req, res) => {
  try {
    const data = req.body;
    
    // Find the first branding entry
    let branding = await prisma.clubBranding.findFirst();
    
    const updateData = {
      clubName: data.clubName,
      fullName: data.fullName,
      tagline: data.tagline,
      description: data.description,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      accentColor: data.accentColor,
      logoUrl: data.logoUrl,
      foundedYear: data.foundedYear,
      university: data.university,
      contactEmail: data.contactEmail,
    };
    
    if (data.socials) {
      updateData.githubUrl = data.socials.github;
      updateData.discordUrl = data.socials.discord;
      updateData.linkedinUrl = data.socials.linkedin;
      updateData.twitterUrl = data.socials.twitter;
      updateData.huggingfaceUrl = data.socials.huggingface;
    }
    
    if (branding) {
      branding = await prisma.clubBranding.update({
        where: { id: branding.id },
        data: updateData
      });
    } else {
      branding = await prisma.clubBranding.create({
        data: {
          id: 'axion-branding',
          ...updateData
        }
      });
    }
    
    // Map database flat format to nested frontend format
    const mappedBranding = {
      id: branding.id,
      clubName: branding.clubName,
      fullName: branding.fullName,
      tagline: branding.tagline,
      description: branding.description,
      primaryColor: branding.primaryColor,
      secondaryColor: branding.secondaryColor,
      accentColor: branding.accentColor,
      logoUrl: branding.logoUrl,
      foundedYear: branding.foundedYear,
      university: branding.university,
      contactEmail: branding.contactEmail,
      socials: {
        github: branding.githubUrl || '',
        discord: branding.discordUrl || '',
        linkedin: branding.linkedinUrl || '',
        twitter: branding.twitterUrl || '',
        huggingface: branding.huggingfaceUrl || ''
      }
    };
    
    res.json({ success: true, branding: mappedBranding });
  } catch (error) {
    console.error('Error updating branding:', error);
    res.status(500).json({ success: false, error: 'Failed to update branding settings' });
  }
});

module.exports = router;
