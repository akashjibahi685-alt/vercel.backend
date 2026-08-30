import React, { useState, useEffect, useCallback } from 'react';
import { useClub } from '../../context/ClubContext';
import { MessageSquare, Send, Clock, Hash, AlertTriangle, Lightbulb } from 'lucide-react';

export default function DiscussionForum() {
  const { currentUser, addToast } = useClub();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeThread, setActiveThread] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/discussions');
      const data = await res.json();
      setThreads(data);
      if (activeThread) {
        setActiveThread(data.find(t => t.id === activeThread.id) || null);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load discussions', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeThread, addToast]);

  useEffect(() => {
    const t = setTimeout(() => fetchThreads(), 0);
    return () => clearTimeout(t);
  }, [fetchThreads]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser.id,
          title: formData.get('title'),
          content: formData.get('content'),
          type: formData.get('type')
        })
      });
      if (res.ok) {
        addToast('Thread created successfully!', 'success');
        fetchThreads();
        e.target.reset();
      } else {
        addToast('Error creating thread', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Network error', 'error');
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`/api/discussions/${activeThread.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser.id,
          content: replyText
        })
      });
      if (res.ok) {
        addToast('Reply posted!', 'success');
        setReplyText('');
        fetchThreads();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to post reply', 'error');
    }
  };

  const getThreadIcon = (type) => {
    if (type === 'Problem') return <AlertTriangle size={14} color="#f43f5e" />;
    if (type === 'Research') return <Lightbulb size={14} color="#8b5cf6" />;
    return <Hash size={14} color="#0ea5e9" />;
  };

  if (loading && threads.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        <p>Connecting to discussion servers...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '24px', animation: 'fadeIn 0.3s ease-out', height: 'calc(100vh - 120px)' }}>
      
      {/* Left Sidebar: Form & Thread List */}
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
        
        {/* Create Thread Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="var(--cyan-accent)" />
            Start a Discussion
          </h3>
          <form onSubmit={handleCreateThread} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <select name="type" className="form-select" required style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}>
                <option value="General">General Talk</option>
                <option value="Problem">Post a Problem</option>
                <option value="Research">Research Discussion</option>
              </select>
            </div>
            <div className="form-group">
              <input required name="title" placeholder="Thread Title" className="form-input" style={{ width: '100%' }} />
            </div>
            <div className="form-group">
              <textarea required name="content" rows="3" placeholder="What's on your mind?" className="form-input" style={{ width: '100%', resize: 'none' }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Broadcast Thread
            </button>
          </form>
        </div>

        {/* Threads List */}
        <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Active Transmissions</h4>
          
          {threads.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '20px 0' }}>
              No active discussions.
            </div>
          )}
          
          {threads.map(thread => {
            const isActive = activeThread?.id === thread.id;
            return (
              <div 
                key={thread.id} 
                onClick={() => setActiveThread(thread)}
                className="hover-lift"
                style={{ 
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)', 
                  cursor: 'pointer',
                  background: isActive ? 'var(--bg-glass)' : 'var(--bg-glass-subtle)',
                  border: isActive ? '1px solid var(--cyan-accent)' : '1px solid var(--border-glass)',
                  boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                  transition: 'all 0.2s ease-out'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ 
                    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', 
                    padding: '4px 8px', borderRadius: '4px',
                    background: thread.type === 'Problem' ? 'rgba(244, 63, 94, 0.1)' : thread.type === 'Research' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                    color: thread.type === 'Problem' ? '#f43f5e' : thread.type === 'Research' ? '#8b5cf6' : '#0ea5e9'
                  }}>
                    {getThreadIcon(thread.type)} {thread.type}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <MessageSquare size={12} /> {thread.replies?.length || 0}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: '1.4' }}>
                  {thread.title}
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} /> {new Date(thread.updatedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side: Active Thread View */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeThread ? (
          <>
            {/* Thread Header */}
            <div style={{ padding: '32px', borderBottom: '1px solid var(--border-glass)', background: 'var(--bg-glass-card)' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.3' }}>
                {activeThread.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan-accent), var(--primary))', 
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem',
                  boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)'
                }}>
                  {activeThread.author?.name?.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeThread.author?.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {new Date(activeThread.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '24px', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {activeThread.content}
              </div>
            </div>

            {/* Replies Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-app)' }}>
              {activeThread.replies?.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', fontStyle: 'italic' }}>
                  Awaiting communications... be the first to reply.
                </div>
              ) : (
                activeThread.replies.map(reply => {
                  const isMe = reply.authorId === currentUser.id;
                  return (
                    <div key={reply.id} style={{ display: 'flex', gap: '16px', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                      <div style={{ 
                        width: '36px', height: '36px', borderRadius: '50%', background: isMe ? 'var(--lavender)' : 'var(--bg-glass-card)', 
                        border: isMe ? 'none' : '1px solid var(--border-glass)',
                        color: isMe ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0
                      }}>
                        {reply.author?.name?.charAt(0)}
                      </div>
                      <div className="glass-panel" style={{ 
                        padding: '16px 20px', 
                        borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px', 
                        background: isMe ? 'rgba(139, 92, 246, 0.05)' : 'var(--bg-glass-card)',
                        border: isMe ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid var(--border-glass)',
                        maxWidth: '85%'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '16px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isMe ? 'var(--lavender)' : 'var(--text-primary)' }}>
                            {reply.author?.name} {isMe && '(You)'}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form */}
            <div style={{ padding: '24px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-glass)' }}>
              <form onSubmit={handlePostReply} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Transmit your reply..." 
                  className="form-input"
                  style={{ flex: 1, borderRadius: '999px', padding: '12px 24px' }}
                />
                <button type="submit" disabled={!replyText.trim()} className="btn btn-primary" style={{ borderRadius: '999px', width: '46px', height: '46px', padding: 0, justifyContent: 'center' }}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-glass-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid var(--border-glass)' }}>
              <MessageSquare size={32} style={{ opacity: 0.5 }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>No Channel Selected</h3>
            <p style={{ marginTop: '8px' }}>Select an active transmission to view and reply.</p>
          </div>
        )}
      </div>

    </div>
  );
}

