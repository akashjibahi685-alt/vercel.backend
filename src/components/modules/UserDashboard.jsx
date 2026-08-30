import React, { useState, useEffect, useCallback } from 'react';
import { useClub } from '../../context/ClubContext';
import { Award, FileText, Plus, BookOpen, Clock, Camera, Briefcase, GraduationCap } from 'lucide-react';

export default function UserDashboard() {
  const { currentUser, addToast } = useClub();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('achievements');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/${currentUser.id}`);
      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentUser.id, addToast]);

  useEffect(() => {
    if (currentUser?.id) {
      const t = setTimeout(() => fetchProfile(), 0);
      return () => clearTimeout(t);
    }
  }, [currentUser, fetchProfile]);

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch(`/api/profile/${currentUser.id}/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          badgeUrl: formData.get('badgeUrl')
        })
      });
      if (res.ok) {
        addToast('Achievement added!', 'success');
        fetchProfile();
        e.target.reset();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPaper = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch(`/api/profile/${currentUser.id}/papers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          abstract: formData.get('abstract'),
          pdfUrl: formData.get('pdfUrl'),
          tags: formData.get('tags')
        })
      });
      if (res.ok) {
        addToast('Research paper published!', 'success');
        fetchProfile();
        e.target.reset();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddCertificate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch(`/api/profile/${currentUser.id}/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          issuer: formData.get('issuer'),
          issueDate: formData.get('issueDate'),
          certificateUrl: formData.get('certificateUrl')
        })
      });
      if (res.ok) {
        addToast('Certificate added!', 'success');
        fetchProfile();
        e.target.reset();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddInternship = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch(`/api/profile/${currentUser.id}/internships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: formData.get('company'),
          role: formData.get('role'),
          startDate: formData.get('startDate'),
          endDate: formData.get('endDate'),
          description: formData.get('description')
        })
      });
      if (res.ok) {
        addToast('Internship logged!', 'success');
        fetchProfile();
        e.target.reset();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile) {
      addToast('Please select an image file first.', 'error');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('avatarFile', avatarFile);

      const res = await fetch(`/api/profile/${currentUser.id}/avatar/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        addToast('Profile picture uploaded successfully!', 'success');
        fetchProfile();
        setIsEditingAvatar(false);
        setAvatarFile(null);
      } else {
        addToast('Failed to upload picture', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to upload picture', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        Loading your portal...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#f43f5e' }}>
        Failed to load profile. Please try refreshing.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* Profile Header */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: profileData.avatarUrl ? `url(${profileData.avatarUrl}) center/cover no-repeat` : 'linear-gradient(135deg, var(--cyan-soft), var(--lavender-soft))',
              color: 'var(--cyan-accent)',
              fontSize: '2.5rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--cyan-border)',
              boxShadow: 'var(--shadow-glow)',
              overflow: 'hidden'
            }}
          >
            {!profileData.avatarUrl && profileData.name.charAt(0)}
          </div>
          <button 
            onClick={() => setIsEditingAvatar(!isEditingAvatar)}
            style={{
              position: 'absolute',
              bottom: '-5px',
              right: '-5px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Edit Profile Picture"
          >
            <Camera size={16} />
          </button>
        </div>
        
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>{profileData.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 500, marginBottom: '12px' }}>
            {profileData.title || profileData.role || 'Student Explorer'}
          </p>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="var(--amber)" /> {profileData.achievements?.length || 0} Achievements
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} color="var(--primary)" /> {profileData.researchPapers?.length || 0} Papers
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={16} color="var(--cyan-accent)" /> {profileData.certificates?.length || 0} Certificates
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={16} color="var(--lavender)" /> {profileData.internships?.length || 0} Internships
            </span>
          </div>
        </div>

        {isEditingAvatar && (
          <form onSubmit={handleUpdateAvatar} style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '16px', background: 'var(--bg-glass-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <input 
              type="file" 
              accept="image/*"
              className="form-input" 
              style={{ flex: 1, padding: '4px' }}
              onChange={e => setAvatarFile(e.target.files[0])}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Upload</button>
            <button type="button" className="btn btn-secondary" style={{ padding: '8px 16px' }} onClick={() => { setIsEditingAvatar(false); setAvatarFile(null); }}>Cancel</button>
          </form>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('achievements')}
          style={{
            padding: '14px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'achievements' ? '3px solid var(--cyan-accent)' : '3px solid transparent',
            color: activeTab === 'achievements' ? 'var(--cyan-accent)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Award size={18} /> My Achievements
        </button>
        <button
          onClick={() => setActiveTab('papers')}
          style={{
            padding: '14px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'papers' ? '3px solid var(--lavender)' : '3px solid transparent',
            color: activeTab === 'papers' ? 'var(--lavender)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <FileText size={18} /> Research Papers
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          style={{
            padding: '14px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'certificates' ? '3px solid var(--emerald)' : '3px solid transparent',
            color: activeTab === 'certificates' ? 'var(--emerald)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <GraduationCap size={18} /> Certificates
        </button>
        <button
          onClick={() => setActiveTab('internships')}
          style={{
            padding: '14px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'internships' ? '3px solid var(--rose)' : '3px solid transparent',
            color: activeTab === 'internships' ? 'var(--rose)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Briefcase size={18} /> Internships
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Left Column: Data Display */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'achievements' && (
            <>
              {profileData.achievements?.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', borderStyle: 'dashed' }}>
                  <Award size={48} color="var(--border-light)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Achievements Yet</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Log your hackathon wins, courses, or special milestones here.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {profileData.achievements.map(ach => (
                    <div key={ach.id} className="glass-panel hover-lift" style={{ padding: '20px', display: 'flex', gap: '16px' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                        background: 'var(--amber-soft)', color: 'var(--amber)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {ach.badgeUrl ? <img src={ach.badgeUrl} alt="badge" style={{ width: '32px', height: '32px' }} /> : <Award size={24} />}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{ach.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>{ach.description}</p>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {new Date(ach.dateEarned).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'papers' && (
            <>
              {profileData.researchPapers?.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', borderStyle: 'dashed' }}>
                  <BookOpen size={48} color="var(--border-light)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Research Papers</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Publish your technical reports, AI research, and ML abstracts here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {profileData.researchPapers.map(paper => (
                    <div key={paper.id} className="glass-panel hover-lift" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{paper.title}</h4>
                        <span className="badge badge-lavender">
                          {new Date(paper.publishedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                        {paper.abstract}
                      </p>
                      {paper.tags && (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                          {JSON.parse(paper.tags).split(',').map((tag, i) => (
                            <span key={i} className="badge" style={{ background: 'var(--bg-glass-subtle)', border: '1px solid var(--border-glass)' }}>
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {paper.pdfUrl && (
                        <a href={paper.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                          <FileText size={14} /> Read Full Paper
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'certificates' && (
            <>
              {profileData.certificates?.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', borderStyle: 'dashed' }}>
                  <GraduationCap size={48} color="var(--border-light)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Certificates</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Log your completed courses and technical certifications here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {profileData.certificates.map(cert => (
                    <div key={cert.id} className="glass-panel hover-lift" style={{ padding: '20px', display: 'flex', gap: '16px' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                        background: 'var(--emerald-soft)', color: 'var(--emerald)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{cert.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{cert.issuer}</p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {new Date(cert.issueDate).toLocaleDateString()}
                          </span>
                          {cert.certificateUrl && (
                            <a href={cert.certificateUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--cyan-accent)', textDecoration: 'none' }}>
                              View Credential
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'internships' && (
            <>
              {profileData.internships?.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', borderStyle: 'dashed' }}>
                  <Briefcase size={48} color="var(--border-light)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Internships</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Log your professional experience and industry internships here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {profileData.internships.map(intern => (
                    <div key={intern.id} className="glass-panel hover-lift" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{intern.role}</h4>
                          <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{intern.company}</span>
                        </div>
                        <span className="badge badge-rose">
                          {new Date(intern.startDate).toLocaleDateString()} - {intern.endDate ? new Date(intern.endDate).toLocaleDateString() : 'Present'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {intern.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: Forms */}
        <div className="glass-panel" style={{ padding: '24px', width: '380px', flexShrink: 0, position: 'sticky', top: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--cyan-soft)', color: 'var(--cyan-accent)' }}>
              <Plus size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              {activeTab === 'achievements' && 'Log New Achievement'}
              {activeTab === 'papers' && 'Publish New Paper'}
              {activeTab === 'certificates' && 'Add Certificate'}
              {activeTab === 'internships' && 'Log Internship'}
            </h3>
          </div>
          
          {activeTab === 'achievements' && (
            <form onSubmit={handleAddAchievement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Achievement Title</label>
                <input required name="title" className="form-input" placeholder="e.g. Kaggle Grandmaster, Hackathon Winner" />
              </div>
              <div className="form-group">
                <label className="form-label">Description & Details</label>
                <textarea name="description" rows="3" className="form-input" placeholder="What did you build or achieve?"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Badge Image URL (Optional)</label>
                <input name="badgeUrl" type="url" className="form-input" placeholder="https://..." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%' }}>
                <Award size={16} /> Add Achievement
              </button>
            </form>
          )}

          {activeTab === 'papers' && (
            <form onSubmit={handleAddPaper} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Research Title</label>
                <input required name="title" className="form-input" placeholder="e.g. Attention is All You Need" />
              </div>
              <div className="form-group">
                <label className="form-label">Abstract</label>
                <textarea required name="abstract" rows="4" className="form-input" placeholder="Summary of your research methodology and findings..."></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input name="tags" placeholder="e.g. NLP, Transformers, PyTorch" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Link to PDF (Optional)</label>
                <input type="url" name="pdfUrl" className="form-input" placeholder="https://..." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%', background: 'var(--lavender)', borderColor: 'var(--lavender)' }}>
                <FileText size={16} /> Publish Paper
              </button>
            </form>
          )}

          {activeTab === 'certificates' && (
            <form onSubmit={handleAddCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Certificate Title</label>
                <input required name="title" className="form-input" placeholder="e.g. AWS Certified Solutions Architect" />
              </div>
              <div className="form-group">
                <label className="form-label">Issuing Organization</label>
                <input required name="issuer" className="form-input" placeholder="e.g. Amazon Web Services" />
              </div>
              <div className="form-group">
                <label className="form-label">Issue Date</label>
                <input required name="issueDate" type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Credential URL (Optional)</label>
                <input name="certificateUrl" type="url" className="form-input" placeholder="https://..." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%', background: 'var(--emerald)', borderColor: 'var(--emerald)' }}>
                <GraduationCap size={16} /> Add Certificate
              </button>
            </form>
          )}

          {activeTab === 'internships' && (
            <form onSubmit={handleAddInternship} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Company / Organization</label>
                <input required name="company" className="form-input" placeholder="e.g. Google, Research Lab" />
              </div>
              <div className="form-group">
                <label className="form-label">Role / Position</label>
                <input required name="role" className="form-input" placeholder="e.g. Software Engineering Intern" />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Start Date</label>
                  <input required name="startDate" type="date" className="form-input" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">End Date (Optional)</label>
                  <input name="endDate" type="date" className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" rows="3" className="form-input" placeholder="Describe your responsibilities..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%', background: 'var(--rose)', borderColor: 'var(--rose)' }}>
                <Briefcase size={16} /> Log Internship
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
