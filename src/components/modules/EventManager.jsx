import React, { useState } from 'react';
import { useClub } from '../../context/ClubContext';
import { Modal } from '../layout/Modal';
import {
  Calendar,
  Plus,
  MapPin,
  User,
  Users,
  Edit2,
  Trash2,
  Download
} from 'lucide-react';

export function EventManager() {
  const { data, addEvent, updateEvent, deleteEvent } = useClub();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedType, setSelectedType] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [rosterEvent, setRosterEvent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Workshop',
    date: '2026-09-12',
    time: '18:00 - 20:00 IST',
    location: 'Turing Lab 402 / Hybrid',
    speaker: 'Aarav Sharma',
    capacity: 100,
    tags: 'GenAI, Hands-on, Code',
    description: '',
    status: 'Upcoming'
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      type: 'Workshop',
      date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      time: '18:00 - 20:00 IST',
      location: 'Turing Lab 402 / Hybrid',
      speaker: 'Core AI Lead',
      capacity: 120,
      tags: 'Deep Learning, PyTorch',
      description: 'Hands-on deep dive into advanced machine intelligence architectures and practical modeling.',
      status: 'Upcoming'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title,
      type: evt.type,
      date: evt.date,
      time: evt.time,
      location: evt.location,
      speaker: evt.speaker,
      capacity: evt.capacity,
      tags: (evt.tags || []).join(', '),
      description: evt.description,
      status: evt.status
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        ...formData,
        tags: tagsArray
      });
      setEditingEvent(null);
    } else {
      addEvent({
        ...formData,
        tags: tagsArray
      });
      setIsAddModalOpen(false);
    }
  };

  const filteredEvents = (data.events || []).filter((e) => {
    if (selectedType === 'All') return true;
    return e.type === selectedType;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Hackathon':
        return <span className="badge badge-lavender">Hackathon</span>;
      case 'Workshop':
        return <span className="badge badge-cyan">Workshop</span>;
      case 'Guest Lecture':
        return <span className="badge badge-blue">Guest Lecture</span>;
      default:
        return <span className="badge badge-emerald">{type}</span>;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Toolbar */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Event & Workshop Management</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Create, schedule, track RSVPs, and manage event attendee rosters
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* View Switcher */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: 'var(--radius-md)' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
                  color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
              >
                Cards View
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: viewMode === 'list' ? 'var(--bg-surface)' : 'transparent',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
                  color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
              >
                Table View
              </button>
            </div>

            <button onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          {['All', 'Workshop', 'Hackathon', 'Guest Lecture'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: selectedType === type ? 'var(--cyan-accent)' : 'var(--border-light)',
                background: selectedType === type ? 'var(--cyan-soft)' : 'var(--bg-surface)',
                color: selectedType === type ? '#0891b2' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredEvents.map((evt) => {
            const rsvpPercent = Math.min(100, Math.round(((evt.rsvps || 0) / (evt.capacity || 100)) * 100));
            return (
              <div
                key={evt.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    {getTypeBadge(evt.type)}
                    <span className="badge badge-emerald">{evt.status}</span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px', lineHeight: '1.4' }}>
                    {evt.title}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                    {evt.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={15} color="var(--cyan-accent)" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color="#8b5cf6" />
                      <span>{evt.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={15} color="#10b981" />
                      <span>Instructor: <strong>{evt.speaker}</strong></span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '14px' }}>
                    {(evt.tags || []).map((tag, idx) => (
                      <span key={idx} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Capacity Bar */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                      <span>RSVPs & Reservations</span>
                      <span style={{ color: rsvpPercent > 85 ? '#f43f5e' : 'var(--cyan-accent)' }}>
                        {evt.rsvps} / {evt.capacity} ({rsvpPercent}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${rsvpPercent}%`,
                          height: '100%',
                          background: rsvpPercent > 85 ? '#f43f5e' : 'var(--cyan-accent)',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                    <button
                      onClick={() => setRosterEvent(evt)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                    >
                      <Users size={14} />
                      <span>Roster ({evt.attendees?.length || 0})</span>
                    </button>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="btn-icon"
                        title="Edit Event"
                        style={{ color: '#0ea5e9' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete event "${evt.title}"?`)) {
                            deleteEvent(evt.id);
                          }
                        }}
                        className="btn-icon"
                        title="Delete Event"
                        style={{ color: '#f43f5e' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="custom-table-container glass-panel">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Event Title & Type</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Key Speaker</th>
                <th>RSVP Progress</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => (
                <tr key={evt.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{evt.title}</div>
                    <div style={{ marginTop: '4px' }}>{getTypeBadge(evt.type)}</div>
                  </td>
                  <td>{evt.date} <br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{evt.time}</span></td>
                  <td>{evt.location}</td>
                  <td>{evt.speaker}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--cyan-accent)' }}>{evt.rsvps}</span> / {evt.capacity}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button onClick={() => setRosterEvent(evt)} className="btn-icon" title="View Roster">
                        <Users size={16} />
                      </button>
                      <button onClick={() => handleOpenEdit(evt)} className="btn-icon" title="Edit" style={{ color: '#0ea5e9' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteEvent(evt.id)} className="btn-icon" title="Delete" style={{ color: '#f43f5e' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingEvent}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEvent(null);
        }}
        title={editingEvent ? 'Edit Event Details' : 'Schedule New Event'}
        subtitle="Workshops, Hackathons, Paper Discussions, and Speaker Lectures"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Fine-Tuning Open Source LLMs"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Event Category</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="form-select"
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Guest Lecture">Guest Lecture</option>
                <option value="Reading Group">Paper Reading Group</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Time & Duration</label>
              <input
                type="text"
                placeholder="18:00 - 20:30 IST"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attendee Capacity</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Location / Room / Link</label>
              <input
                type="text"
                placeholder="Turing Lab 402 or Meet URL"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Speaker / Host</label>
              <input
                type="text"
                placeholder="Speaker name or guest"
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. GenAI, PyTorch, LoRA"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              placeholder="Provide event syllabus, prerequisites, and goals..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingEvent(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingEvent ? 'Update Event' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Attendee Roster Modal */}
      <Modal
        isOpen={!!rosterEvent}
        onClose={() => setRosterEvent(null)}
        title={rosterEvent ? `Attendee Roster — ${rosterEvent.title}` : 'Attendee Roster'}
        subtitle={`Current confirmed RSVPs: ${rosterEvent?.rsvps || 0} / ${rosterEvent?.capacity || 0}`}
        maxWidth="620px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Registered Participants List
            </span>
            <button
              onClick={() => {
                alert('Exported attendee roster to CSV.');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <Download size={14} />
              <span>Export Roster</span>
            </button>
          </div>

          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Email</th>
                  <th>Check-In Status</th>
                </tr>
              </thead>
              <tbody>
                {(rosterEvent?.attendees || []).length > 0 ? (
                  rosterEvent.attendees.map((att, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{att.name}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{att.email}</td>
                      <td>
                        <span className={`badge ${att.checkedIn ? 'badge-emerald' : 'badge-amber'}`}>
                          {att.checkedIn ? 'Checked In' : 'Registered'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No manual check-in entries yet. Total RSVPs counter: {rosterEvent?.rsvps}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
}
