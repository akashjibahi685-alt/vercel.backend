import React, { useState } from 'react';
import { useClub } from '../../context/ClubContext';
import confetti from 'canvas-confetti';
import {
  Send,
  Radio,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export function NotificationCenter() {
  const { data, broadcastNotification, deleteNotification } = useClub();

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audience: 'All Active Members',
    channel: 'Email & In-App Push'
  });

  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcast = (e) => {
    e.preventDefault();
    setIsBroadcasting(true);

    setTimeout(() => {
      broadcastNotification({
        title: formData.title,
        message: formData.message,
        audience: formData.audience,
        channel: formData.channel
      });

      // Confetti effect
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      setFormData({
        title: '',
        message: '',
        audience: 'All Active Members',
        channel: 'Email & In-App Push'
      });
      setIsBroadcasting(false);
    }, 400);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Broadcast & Notification Center</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Send automated notifications, urgent announcements, and event updates to club members
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Broadcast Composer */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--cyan-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-accent)'
              }}
            >
              <Radio size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Compose New Broadcast</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instant member alerts & emails</p>
            </div>
          </div>

          <form onSubmit={handleBroadcast}>
            <div className="form-group">
              <label className="form-label">Alert Headline / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Hackathon Pitch Deck Submissions Open"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="form-select"
                >
                  <option value="All Active Members">All Active Members (340+)</option>
                  <option value="Core Leads & Researchers">Core Leads & Researchers Only</option>
                  <option value="Workshop Attendees">Upcoming Workshop Attendees</option>
                  <option value="Alumni Network">Alumni Mentors</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Channel</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  className="form-select"
                >
                  <option value="Email & In-App Push">Email & In-App Push</option>
                  <option value="In-App Push Only">In-App Push Only</option>
                  <option value="Discord Webhook & Email">Discord Webhook & Email</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notification Message Body *</label>
              <textarea
                required
                rows={4}
                placeholder="Provide instructions, meeting links, or critical deadlines..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                marginBottom: '18px'
              }}
            >
              <CheckCircle2 size={16} color="#10b981" />
              <span>Simulated broadcast will trigger live toast alert and update history log immediately.</span>
            </div>

            <button
              type="submit"
              disabled={isBroadcasting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '11px' }}
            >
              <Send size={16} />
              <span>{isBroadcasting ? 'Broadcasting...' : 'Send Broadcast Now'}</span>
            </button>
          </form>
        </div>

        {/* Broadcast History */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Broadcast Dispatch History</h3>
            <span className="badge badge-cyan">{data.notifications?.length || 0} Total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {(data.notifications || []).map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass-subtle)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {notif.title}
                  </span>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="btn-icon"
                    style={{ color: '#f43f5e', padding: '2px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '8px' }}>
                  {notif.message}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                  <span>Audience: <strong>{notif.audience}</strong></span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Delivered: {notif.deliveryRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
