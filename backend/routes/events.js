const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

function formatEvent(e) {
  return {
    ...e,
    date: e.eventDate ? new Date(e.eventDate).toISOString().split('T')[0] : '',
    time: e.eventTime || '',
    tags: (e.tags || []).map(t => t.tag),
    rsvps: (e.attendees || []).length,
    attendees: (e.attendees || []).map(a => ({ name: a.name, email: a.email, checkedIn: a.checkedIn }))
  };
}

// Create event
router.post('/', async (req, res) => {
  try {
    const { title, type, date, time, location, speaker, capacity, description, tags } = req.body;
    
    const event = await prisma.event.create({
      data: {
        title,
        type,
        eventDate: new Date(date),
        eventTime: time,
        location,
        speaker,
        capacity: parseInt(capacity) || 100,
        description,
        tags: {
          create: (tags || []).map(t => ({ tag: t }))
        }
      },
      include: { tags: true, attendees: true }
    });
    
    res.json({ success: true, event: formatEvent(event) });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, date, time, location, speaker, capacity, description, status, tags } = req.body;
    
    // Delete existing tags first
    await prisma.eventTag.deleteMany({ where: { eventId: id } });
    
    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        type,
        eventDate: date ? new Date(date) : undefined,
        eventTime: time,
        location,
        speaker,
        capacity: capacity ? parseInt(capacity) : undefined,
        description,
        status,
        tags: {
          create: (tags || []).map(t => ({ tag: t }))
        }
      },
      include: { tags: true, attendees: true }
    });
    
    res.json({ success: true, event: formatEvent(event) });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, error: 'Failed to delete event' });
  }
});

// RSVP to event
router.post('/:id/rsvp', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    const attendee = await prisma.eventAttendee.create({
      data: {
        eventId: id,
        name,
        email
      }
    });
    
    res.json({ success: true, attendee });
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    res.status(500).json({ success: false, error: 'Failed to RSVP' });
  }
});

module.exports = router;
