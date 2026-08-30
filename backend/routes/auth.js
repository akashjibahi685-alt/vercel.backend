const express = require('express');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();
const prisma = new PrismaClient();
const SALT = 'axion_v1_2026_salt';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_me';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { permissions: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials or account not approved' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials or account not approved' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        avatar: user.avatarUrl,
        permissions: user.permissions.map(p => p.permission),
        token
      }
    });

    // Async update last login
    prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(console.error);
    
    // Activity log
    prisma.activityLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'Signed in',
        type: 'auth'
      }
    }).catch(console.error);

  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password, adminSecretKey, department } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Name, email, and password required' });

  try {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    
    // Check if there is already a pending join request
    const existingReq = await prisma.joinRequest.findFirst({
      where: { email: email.toLowerCase().trim(), status: 'Pending' }
    });
    if (existingReq) return res.status(400).json({ error: 'A pending request with this email already exists' });

    let finalRole = 'Member';
    let isAdmin = false;
    let permissionsData = [];
    const passwordHash = await bcrypt.hash(password, 10);

    // If an admin secret is provided, register them immediately as a staff/admin.
    if (adminSecretKey) {
      const tokenRecord = await prisma.adminInviteToken.findFirst({
        where: { isUsed: false }
      });
      
      if (tokenRecord) {
        const inputHash = crypto.createHash('sha256').update(SALT + adminSecretKey + SALT).digest('hex');
        if (inputHash === tokenRecord.tokenHash) {
          finalRole = 'Head Administrator';
          isAdmin = true;
          permissionsData = [{ permission: 'ALL' }];
        } else {
           return res.status(401).json({ error: 'Invalid admin secret key' });
        }
      } else {
         return res.status(401).json({ error: 'Invalid admin secret key' });
      }

      // Create admin user directly
      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          passwordHash,
          role: finalRole,
          title: department ? `${department} Lead` : `${finalRole}`,
          isAdmin,
          permissions: { create: permissionsData }
        },
        include: { permissions: true }
      });

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });

      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          avatar: user.avatarUrl,
          permissions: user.permissions.map(p => p.permission),
          token
        }
      });
    }

    // Otherwise, create a Join Request for the student to be approved by admins
    await prisma.joinRequest.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        department: department || 'General',
        passwordHash,
        status: 'Pending'
      }
    });

    prisma.activityLog.create({
      data: {
        userName: name.trim(),
        action: 'Submitted Join Request',
        type: 'auth'
      }
    }).catch(console.error);

    res.json({
      success: true,
      pending: true,
      message: 'Registration submitted successfully. Please wait for an administrator to approve your account.'
    });

  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ error: 'Failed to register account' });
  }
});

// Admin override password
router.post('/admin/users/:userId/password', async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: 'New password required' });

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { passwordHash }
    });

    // Log the override action
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'Admin Overrode Password',
        type: 'auth'
      }
    });

    res.json({ success: true, message: 'Password overridden successfully' });
  } catch (error) {
    console.error('Password override error', error);
    res.status(500).json({ error: 'Failed to override password' });
  }
});

module.exports = router;
