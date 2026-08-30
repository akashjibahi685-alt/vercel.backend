import React from 'react';
import { useClub } from '../../context/ClubContext';
import {
  Users,
  FolderGit2,
  Calendar,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Megaphone,
  ChevronRight
} from 'lucide-react';

export function DashboardOverview() {
  const { data, setActiveTab } = useClub();

  const stats = [
    {
      title: 'Active Members',
      value: data.stats.totalMembers || data.members?.length || 0,
      change: '+14% this month',
      icon: Users,
      color: 'var(--cyan-accent)',
      bg: 'var(--cyan-soft)',
      tab: 'members'
    },
    {
      title: 'Active AI Projects',
      value: data.stats.activeProjects || data.projects?.length || 0,
      change: '3 in review',
      icon: FolderGit2,
      color: '#0ea5e9',
      bg: '#f0f9ff',
      tab: 'projects'
    },
    {
      title: 'Upcoming Events',
      value: data.stats.upcomingEvents || data.events?.length || 0,
      change: '2 workshops this week',
      icon: Calendar,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      tab: 'events'
    },
    {
      title: 'Engagement Index',
      value: data.stats.engagementRate || '94.6%',
      change: '+4.2% peer score',
      icon: Zap,
      color: '#10b981',
      bg: '#ecfdf5',
      tab: 'dashboard'
    }
  ];

  // Growth Trend Chart calculations
  const trendData = data.stats.growthTrend || [];
  const maxVal = Math.max(...trendData.map((d) => Math.max(d.members, d.rsvps)), 400);

  // Active announcement
  const activeAnnouncement = (data.announcements || []).find((a) => a.isActive);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Dynamic Announcement Banner if active */}
      {activeAnnouncement && (
        <div
          className="glass-panel"
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(139, 92, 246, 0.08))',
            border: '1px solid var(--cyan-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--cyan-accent)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)'
              }}
            >
              <Megaphone size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {activeAnnouncement.title}
                <span className={`badge ${activeAnnouncement.urgency === 'High' ? 'badge-rose' : 'badge-cyan'}`}>
                  {activeAnnouncement.urgency} Priority
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {activeAnnouncement.content}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('cms')}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            Manage Banner
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '20px',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setActiveTab(stat.tab)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color
                  }}
                >
                  <Icon size={22} />
                </div>
                <ArrowUpRight size={18} color="var(--text-muted)" />
              </div>

              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {stat.title}
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 6px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={13} />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Domain Breakdown Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px'
        }}
      >
        {/* Growth & Workshop Trends Spline Graph */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Member & RSVP Growth Analytics</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Cumulative student registrations vs event turnouts
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--cyan-accent)' }} />
                <span>Members</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }} />
                <span>RSVPs</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div style={{ width: '100%', height: '200px', position: 'relative' }}>
            <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--cyan-accent)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--cyan-accent)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 45, 90, 135].map((y, i) => (
                <line key={i} x1="0" y1={y} x2="500" y2={y} stroke="var(--border-light)" strokeDasharray="3 3" />
              ))}

              {/* Member Line */}
              {trendData.length > 1 && (
                <>
                  {/* Area fill */}
                  <path
                    d={`M 0,${160 - (trendData[0].members / maxVal) * 140} ${trendData
                      .map((d, i) => `L ${(i / (trendData.length - 1)) * 500},${160 - (d.members / maxVal) * 140}`)
                      .join(' ')} L 500,160 L 0,160 Z`}
                    fill="url(#cyanGrad)"
                  />
                  {/* Stroke */}
                  <path
                    d={`M 0,${160 - (trendData[0].members / maxVal) * 140} ${trendData
                      .map((d, i) => `L ${(i / (trendData.length - 1)) * 500},${160 - (d.members / maxVal) * 140}`)
                      .join(' ')}`}
                    fill="none"
                    stroke="var(--cyan-accent)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* RSVP Line */}
              {trendData.length > 1 && (
                <path
                  d={`M 0,${160 - (trendData[0].rsvps / maxVal) * 140} ${trendData
                    .map((d, i) => `L ${(i / (trendData.length - 1)) * 500},${160 - (d.rsvps / maxVal) * 140}`)
                    .join(' ')}`}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
              )}

              {/* Data points */}
              {trendData.map((d, i) => {
                const x = (i / (trendData.length - 1)) * 500;
                const yMem = 160 - (d.members / maxVal) * 140;
                return (
                  <g key={i}>
                    <circle cx={x} cy={yMem} r="5" fill="var(--bg-surface)" stroke="var(--cyan-accent)" strokeWidth="2.5" />
                    <text x={x} y="175" textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontWeight="600">
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* AI Research Domain Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Research Domain Breakdown</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Active project allocations & study tracks
              </p>
            </div>
            <span className="badge badge-lavender">4 Domains</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(data.stats.domainBreakdown || []).map((item, idx) => {
              const colors = ['var(--cyan-accent)', '#0ea5e9', '#8b5cf6', '#10b981'];
              const color = colors[idx % colors.length];
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.domain}</span>
                    <span style={{ fontWeight: 700, color }}>{item.percentage}% ({item.count} projects)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '999px',
                        transition: 'width 1s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed & Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}
      >
        {/* Real-time Activity Feed */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="pulse-dot" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Live Activity Feed</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Real-time audit log
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(data.activityLog || []).map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass-subtle)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.8125rem'
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: log.type === 'event' ? '#8b5cf6' : log.type === 'project' ? 'var(--cyan-accent)' : '#10b981',
                    marginTop: '6px'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{log.user}</strong>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>{log.action}:</span>{' '}
                    <span style={{ fontWeight: 600, color: '#0ea5e9' }}>{log.target}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {log.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launchpad & Highlights */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>
              Administrative Launchpad
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Common workflows and club management shortcuts
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => setActiveTab('events')}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} color="#8b5cf6" />
                  <span style={{ fontWeight: 600 }}>Schedule Workshop or Hackathon</span>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>

              <button
                onClick={() => setActiveTab('cms')}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={18} color="var(--cyan-accent)" />
                  <span style={{ fontWeight: 600 }}>Update Landing Page Hero & FAQs</span>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'space-between', padding: '12px 16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Megaphone size={18} color="#f43f5e" />
                  <span style={{ fontWeight: 600 }}>Broadcast In-App Notification</span>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #f0fdfa, #ecfeff)',
              border: '1px solid var(--cyan-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0891b2' }}>
                Need to preview public site?
              </div>
              <div style={{ fontSize: '0.72rem', color: '#0e7490' }}>
                All CMS changes reflect dynamically in real-time.
              </div>
            </div>
            <button
              onClick={() => setActiveTab('cms')}
              className="btn btn-primary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Open CMS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
