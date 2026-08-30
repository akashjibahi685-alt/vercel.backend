import React, { useState } from 'react';
import { useClub } from '../../context/ClubContext';
import { Modal } from '../layout/Modal';
import { GithubIcon } from '../common/Icons';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Video,
  FileText,
  Code2,
  CheckCircle,
  Play,
  CheckCircle2,
  Search,
  Copy,
  Check,
  Award
} from 'lucide-react';

export function StudentLearningHub() {
  const { data, completedLessons, toggleLessonCompleted } = useClub();

  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  const domains = data.learningDomains || [];
  const resources = data.learningResources || [];

  const handleCopyCode = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const filteredResources = resources.filter((item) => {
    const matchDomain = selectedDomain === 'All' || item.domainId === selectedDomain;
    const matchType = selectedType === 'All' || item.type === selectedType;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.instructor && item.instructor.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchDomain && matchType && matchSearch;
  });

  const totalLessons = resources.length;
  const completedCount = completedLessons.filter((id) => resources.some((r) => r.id === id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleToggleComplete = (id) => {
    const isNowCompleting = !completedLessons.includes(id);
    toggleLessonCompleted(id);
    if (isNowCompleting) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Student LMS Banner & Progress Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(139, 92, 246, 0.08))',
          border: '1px solid var(--cyan-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'white', color: '#0891b2', fontSize: '0.78rem', fontWeight: 700, marginBottom: '10px' }}>
              <GraduationCap size={15} />
              <span>AXION AI & MACHINE LEARNING ACADEMY</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Student Learning Hub & Master Tracks
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: '1.5' }}>
              Structured, hands-on curricula curated by AXION researchers. Access full lecture video playlists, downloadable mathematical notes, Google Colab notebooks, and production PyTorch source codes.
            </p>
          </div>

          {/* Progress Card */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'white',
              boxShadow: 'var(--shadow-md)',
              minWidth: '220px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Your Learning Path</span>
              <Award size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0891b2', marginBottom: '6px' }}>
              {progressPercent}% Complete
            </div>
            <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #0ea5e9)', borderRadius: '999px', transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {completedCount} of {totalLessons} modules finished
            </div>
          </div>
        </div>
      </div>

      {/* Domain Track Selection Grid */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Select AI Research Domain:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedDomain('All')}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: selectedDomain === 'All' ? 'var(--cyan-accent)' : 'var(--border-light)',
              background: selectedDomain === 'All' ? 'var(--cyan-accent)' : 'var(--bg-surface)',
              color: selectedDomain === 'All' ? 'white' : 'var(--text-secondary)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            All Tracks ({resources.length})
          </button>

          {domains.map((dom) => {
            const isSelected = selectedDomain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => setSelectedDomain(dom.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: isSelected ? dom.accent || 'var(--cyan-accent)' : 'var(--border-light)',
                  background: isSelected ? dom.accent || 'var(--cyan-accent)' : 'var(--bg-surface)',
                  color: isSelected ? 'white' : 'var(--text-primary)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {dom.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Type Filters */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search lessons, source code repos, mathematical notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '0.84rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Video & Playlist', 'Lecture Notes & Cheatsheet', 'Source Code & Notebook'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: selectedType === type ? 'var(--cyan-soft)' : '#f8fafc',
                color: selectedType === type ? '#0891b2' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Curriculum Resource Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {filteredResources.map((item) => {
          const isCompleted = completedLessons.includes(item.id);
          return (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                borderTop: isCompleted ? '4px solid #10b981' : '4px solid var(--border-light)',
                background: isCompleted ? 'rgba(240, 253, 244, 0.4)' : 'var(--bg-glass-card)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.type === 'Video & Playlist' ? (
                      <Video size={16} color="#0891b2" />
                    ) : item.type === 'Lecture Notes & Cheatsheet' ? (
                      <FileText size={16} color="#8b5cf6" />
                    ) : (
                      <Code2 size={16} color="#10b981" />
                    )}
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {item.type}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleComplete(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      border: isCompleted ? '1px solid #a7f3d0' : '1px solid var(--border-light)',
                      background: isCompleted ? '#ecfdf5' : 'white',
                      color: isCompleted ? '#059669' : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle size={13} />
                    <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px', lineHeight: '1.4' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.5' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <div>📚 <strong>Track:</strong> {item.domainName}</div>
                  <div>👤 <strong>Instructor:</strong> {item.instructor} • {item.duration}</div>
                </div>
              </div>

              <div>
                {/* Action Launchpad Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                  {item.videoUrl && (
                    <button
                      onClick={() => setActiveVideoModal(item)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.78rem', padding: '6px 14px', flex: 1 }}
                    >
                      <Play size={13} />
                      <span>Watch Lesson</span>
                    </button>
                  )}

                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      <GithubIcon size={14} />
                      <span>Source Code</span>
                    </a>
                  )}

                  {item.notesPdfUrl && item.notesPdfUrl !== '#' && (
                    <a
                      href={item.notesPdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      <FileText size={14} color="#8b5cf6" />
                      <span>Notes</span>
                    </a>
                  )}

                  {item.colabUrl && (
                    <a
                      href={item.colabUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      <Code2 size={14} color="#10b981" />
                      <span>Colab</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video / Lecture Player Modal */}
      <Modal
        isOpen={!!activeVideoModal}
        onClose={() => setActiveVideoModal(null)}
        title={activeVideoModal?.title || 'Interactive Lesson'}
        subtitle={`Presented by ${activeVideoModal?.instructor || 'Instructor'} • ${activeVideoModal?.domainName || 'AI Track'}`}
        maxWidth="760px"
      >
        {activeVideoModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Embedded Video Placeholder / Player */}
            <div
              style={{
                width: '100%',
                height: '340px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#090d16',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--cyan-accent)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 24px rgba(6, 182, 212, 0.6)',
                  cursor: 'pointer',
                  marginBottom: '12px'
                }}
                onClick={() => {
                  if (activeVideoModal.videoUrl) {
                    window.open(activeVideoModal.videoUrl, '_blank');
                  }
                }}
              >
                <Play size={28} style={{ marginLeft: '4px' }} />
              </div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                {activeVideoModal.title}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '4px' }}>
                Click to open stream on full resolution player
              </div>
            </div>

            {/* Lesson details */}
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#f8fafc', border: '1px solid var(--border-light)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>Lesson Overview & Syllabus</div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {activeVideoModal.description}
              </p>
            </div>

            {/* Quick Git Clone command */}
            {activeVideoModal.githubUrl && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: '#0f172a',
                  color: '#38bdf8',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <code>git clone {activeVideoModal.githubUrl}.git</code>
                <button
                  onClick={() => handleCopyCode(activeVideoModal.id, `git clone ${activeVideoModal.githubUrl}.git`)}
                  className="btn-icon"
                  style={{ color: 'white' }}
                  title="Copy git clone"
                >
                  {copiedCodeId === activeVideoModal.id ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                </button>
              </div>
            )}

            {/* Completion Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <button
                onClick={() => handleToggleComplete(activeVideoModal.id)}
                className="btn"
                style={{
                  background: completedLessons.includes(activeVideoModal.id) ? '#ecfdf5' : 'var(--cyan-soft)',
                  color: completedLessons.includes(activeVideoModal.id) ? '#059669' : '#0891b2',
                  border: '1px solid var(--cyan-border)',
                  fontSize: '0.84rem'
                }}
              >
                <CheckCircle2 size={16} />
                <span>{completedLessons.includes(activeVideoModal.id) ? 'Marked as Completed ✓' : 'Mark as Completed'}</span>
              </button>

              <button
                onClick={() => setActiveVideoModal(null)}
                className="btn btn-secondary"
              >
                Close Player
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
