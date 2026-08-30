import React, { useState } from 'react';
import { useClub } from '../../context/ClubContext';
import { Modal } from '../layout/Modal';
import { GithubIcon } from '../common/Icons';
import {
  GraduationCap,
  Plus,
  Video,
  FileText,
  Code2,
  FolderDown,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  Search,
  Eye,
  Film
} from 'lucide-react';

export function LearningManager() {
  const {
    data,
    addLearningDomain,
    updateLearningDomain,
    deleteLearningDomain,
    addLearningItem,
    updateLearningItem,
    deleteLearningItem,
    setIsLivePreviewOpen
  } = useClub();

  const [activeTabSection, setActiveTabSection] = useState('resources'); // 'resources' or 'domains'
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [domainForm, setDomainForm] = useState({
    name: '',
    level: 'All Levels',
    accent: '#06b6d4',
    badgeColor: 'badge-cyan',
    description: ''
  });

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    title: '',
    domainId: data.learningDomains?.[0]?.id || 'dom-01',
    type: 'Video & Playlist',
    format: 'Video + Code',
    duration: '45 mins',
    instructor: 'Aarav Sharma',
    videoUrl: '',
    githubUrl: '',
    notesPdfUrl: '',
    colabUrl: '',
    description: '',
    isFeatured: false
  });

  // Handle Domain Modal
  const handleOpenAddDomain = () => {
    setEditingDomain(null);
    setDomainForm({
      name: '',
      level: 'All Levels',
      accent: '#06b6d4',
      badgeColor: 'badge-cyan',
      description: ''
    });
    setIsDomainModalOpen(true);
  };

  const handleOpenEditDomain = (dom) => {
    setEditingDomain(dom);
    setDomainForm({
      name: dom.name,
      level: dom.level,
      accent: dom.accent || '#06b6d4',
      badgeColor: dom.badgeColor || 'badge-cyan',
      description: dom.description
    });
    setIsDomainModalOpen(true);
  };

  const handleDomainSubmit = (e) => {
    e.preventDefault();
    if (editingDomain) {
      updateLearningDomain(editingDomain.id, domainForm);
    } else {
      addLearningDomain(domainForm);
    }
    setIsDomainModalOpen(false);
  };

  // Handle Item Modal
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemForm({
      title: '',
      domainId: data.learningDomains?.[0]?.id || 'dom-01',
      type: 'Video & Playlist',
      format: 'Video + Code',
      duration: '40 mins',
      instructor: 'Aarav Sharma',
      videoUrl: 'https://www.youtube.com/watch?v=kYJyrh5Kz3I',
      githubUrl: 'https://github.com/axion-aiml',
      notesPdfUrl: '',
      colabUrl: '',
      description: 'Provide an overview of the curriculum, prerequisites, code architecture, and learning outcomes...',
      isFeatured: false
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      title: item.title,
      domainId: item.domainId,
      type: item.type,
      format: item.format,
      duration: item.duration,
      instructor: item.instructor,
      videoUrl: item.videoUrl || '',
      githubUrl: item.githubUrl || '',
      notesPdfUrl: item.notesPdfUrl || '',
      colabUrl: item.colabUrl || '',
      description: item.description,
      isFeatured: !!item.isFeatured
    });
    setIsItemModalOpen(true);
  };

  const handleItemSubmit = (e) => {
    e.preventDefault();
    const selectedDomain = (data.learningDomains || []).find((d) => d.id === itemForm.domainId);
    const payload = {
      ...itemForm,
      domainName: selectedDomain ? selectedDomain.name : 'General AI'
    };

    if (editingItem) {
      updateLearningItem(editingItem.id, payload);
    } else {
      addLearningItem(payload);
    }
    setIsItemModalOpen(false);
  };

  const filteredResources = (data.learningResources || []).filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.instructor && r.instructor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchDomain = selectedDomainFilter === 'All' || r.domainId === selectedDomainFilter;
    const matchType = selectedTypeFilter === 'All' || r.type === selectedTypeFilter;

    return matchSearch && matchDomain && matchType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video & Playlist':
        return <Video size={16} color="#0891b2" />;
      case 'Lecture Notes & Cheatsheet':
        return <FileText size={16} color="#8b5cf6" />;
      case 'Source Code & Notebook':
        return <Code2 size={16} color="#10b981" />;
      default:
        return <FolderDown size={16} color="#f59e0b" />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Controls Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <GraduationCap size={20} color="var(--cyan-accent)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Student Learning Hub & LMS Admin</h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Curate and publish domain tracks, structured video playlists, lecture notes, and GitHub source code repositories
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsLivePreviewOpen(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              <Eye size={15} color="var(--cyan-accent)" />
              <span>Student Hub Live View</span>
            </button>

            <button onClick={handleOpenAddDomain} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              <Layers size={15} />
              <span>Add AI Domain</span>
            </button>

            <button onClick={handleOpenAddItem} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <Plus size={16} />
              <span>Post New Resource / Lesson</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
          <button
            onClick={() => setActiveTabSection('resources')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTabSection === 'resources' ? 'var(--cyan-soft)' : 'transparent',
              color: activeTabSection === 'resources' ? '#0891b2' : 'var(--text-secondary)',
              fontWeight: activeTabSection === 'resources' ? 700 : 500,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Film size={16} />
            <span>Lessons, Videos & Notes</span>
            <span style={{ fontSize: '0.72rem', padding: '1px 6px', borderRadius: '999px', background: '#a5f3fc', color: '#0f172a', fontWeight: 700 }}>
              {data.learningResources?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTabSection('domains')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTabSection === 'domains' ? 'var(--cyan-soft)' : 'transparent',
              color: activeTabSection === 'domains' ? '#0891b2' : 'var(--text-secondary)',
              fontWeight: activeTabSection === 'domains' ? 700 : 500,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={16} />
            <span>AI Track Domains</span>
            <span style={{ fontSize: '0.72rem', padding: '1px 6px', borderRadius: '999px', background: '#f1f5f9', color: '#0f172a', fontWeight: 700 }}>
              {data.learningDomains?.length || 0}
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 1: LESSONS & RESOURCES */}
      {activeTabSection === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filters Bar */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search lessons, source codes, playlists, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '34px', fontSize: '0.84rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Domain:</span>
              <select
                value={selectedDomainFilter}
                onChange={(e) => setSelectedDomainFilter(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '7px 12px', fontSize: '0.84rem' }}
              >
                <option value="All">All Domains</option>
                {(data.learningDomains || []).map((dom) => (
                  <option key={dom.id} value={dom.id}>{dom.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Type:</span>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '7px 12px', fontSize: '0.84rem' }}
              >
                <option value="All">All Types</option>
                <option value="Video & Playlist">Video & Playlist</option>
                <option value="Lecture Notes & Cheatsheet">Lecture Notes & Cheatsheet</option>
                <option value="Source Code & Notebook">Source Code & Notebook</option>
              </select>
            </div>
          </div>

          {/* Resources Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getTypeIcon(item.type)}
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {item.type}
                      </span>
                    </div>
                    {item.isFeatured && (
                      <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                        <Sparkles size={11} /> Featured
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px', lineHeight: '1.4' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.5' }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <div>📚 Track: <strong style={{ color: 'var(--text-primary)' }}>{item.domainName || 'General AI'}</strong></div>
                    <div>👤 Instructor: <strong style={{ color: 'var(--text-primary)' }}>{item.instructor}</strong> • {item.duration}</div>
                  </div>
                </div>

                <div>
                  {/* Action Links Attached */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                    {item.videoUrl && (
                      <a href={item.videoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                        <Video size={13} color="#0891b2" />
                        <span>Watch Video</span>
                      </a>
                    )}
                    {item.githubUrl && (
                      <a href={item.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                        <GithubIcon size={13} />
                        <span>Source Code</span>
                      </a>
                    )}
                    {item.notesPdfUrl && item.notesPdfUrl !== '#' && (
                      <a href={item.notesPdfUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                        <FileText size={13} color="#8b5cf6" />
                        <span>Lecture Notes</span>
                      </a>
                    )}
                    {item.colabUrl && (
                      <a href={item.colabUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                        <Code2 size={13} color="#10b981" />
                        <span>Open Colab</span>
                      </a>
                    )}
                  </div>

                  {/* Admin Edit/Delete buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    <button onClick={() => handleOpenEditItem(item)} className="btn-icon" title="Edit Resource" style={{ color: '#0ea5e9' }}>
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete learning resource "${item.title}"?`)) {
                          deleteLearningItem(item.id);
                        }
                      }}
                      className="btn-icon"
                      title="Delete Resource"
                      style={{ color: '#f43f5e' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: DOMAIN TRACKS */}
      {activeTabSection === 'domains' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {(data.learningDomains || []).map((dom) => (
            <div
              key={dom.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${dom.accent || '#06b6d4'}`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className={`badge ${dom.badgeColor || 'badge-cyan'}`}>{dom.level}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {dom.modulesCount || 0} Modules
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
                  {dom.name}
                </h3>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {dom.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                <button onClick={() => handleOpenEditDomain(dom)} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
                  <Edit2 size={14} />
                  <span>Edit Track</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete learning domain "${dom.name}" and all associated lessons?`)) {
                      deleteLearningDomain(dom.id);
                    }
                  }}
                  className="btn btn-danger"
                  style={{ fontSize: '0.78rem' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Domain Modal */}
      <Modal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
        title={editingDomain ? 'Edit AI Domain Track' : 'Create New AI Domain Track'}
        subtitle="Organize curriculum categories, difficulty tiers, and syllabus tracks"
      >
        <form onSubmit={handleDomainSubmit}>
          <div className="form-group">
            <label className="form-label">Domain Track Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Generative AI & Large Language Models"
              value={domainForm.name}
              onChange={(e) => setDomainForm({ ...domainForm, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Target Level</label>
              <select
                value={domainForm.level}
                onChange={(e) => setDomainForm({ ...domainForm, level: e.target.value })}
                className="form-select"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced (Research & SOTA)</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Theme Badge Color</label>
              <select
                value={domainForm.badgeColor}
                onChange={(e) => setDomainForm({ ...domainForm, badgeColor: e.target.value })}
                className="form-select"
              >
                <option value="badge-cyan">Aqua Cyan</option>
                <option value="badge-blue">Sky Blue</option>
                <option value="badge-lavender">Lavender Violet</option>
                <option value="badge-emerald">Emerald Green</option>
                <option value="badge-amber">Warm Amber</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Track Syllabus Description *</label>
            <textarea
              required
              rows={4}
              placeholder="Detail what students will learn in this learning path..."
              value={domainForm.description}
              onChange={(e) => setDomainForm({ ...domainForm, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsDomainModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingDomain ? 'Save Domain' : 'Create Domain'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Resource & Lesson Item Modal */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={editingItem ? 'Edit Learning Resource' : 'Post New Resource / Video Lesson'}
        subtitle="Add videos, playlists, lecture notes, GitHub repos, and Colab notebooks"
        maxWidth="620px"
      >
        <form onSubmit={handleItemSubmit}>
          <div className="form-group">
            <label className="form-label">Resource / Lecture Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Fine-Tuning Mistral-7B with LoRA"
              value={itemForm.title}
              onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">AI Domain Track</label>
              <select
                value={itemForm.domainId}
                onChange={(e) => setItemForm({ ...itemForm, domainId: e.target.value })}
                className="form-select"
              >
                {(data.learningDomains || []).map((dom) => (
                  <option key={dom.id} value={dom.id}>{dom.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Resource Type</label>
              <select
                value={itemForm.type}
                onChange={(e) => setItemForm({ ...itemForm, type: e.target.value })}
                className="form-select"
              >
                <option value="Video & Playlist">Video & Playlist</option>
                <option value="Lecture Notes & Cheatsheet">Lecture Notes & Cheatsheet</option>
                <option value="Source Code & Notebook">Source Code & Notebook</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Instructor / Author</label>
              <input
                type="text"
                placeholder="Aarav Sharma / Dr. Elena"
                value={itemForm.instructor}
                onChange={(e) => setItemForm({ ...itemForm, instructor: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration or Format Tag</label>
              <input
                type="text"
                placeholder="e.g. 45 mins / PDF (12 pgs)"
                value={itemForm.duration}
                onChange={(e) => setItemForm({ ...itemForm, duration: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Video / Playlist Embed URL</label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={itemForm.videoUrl}
              onChange={(e) => setItemForm({ ...itemForm, videoUrl: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">GitHub Source Code URL</label>
              <input
                type="url"
                placeholder="https://github.com/axion-aiml/repo"
                value={itemForm.githubUrl}
                onChange={(e) => setItemForm({ ...itemForm, githubUrl: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Google Colab Notebook URL</label>
              <input
                type="url"
                placeholder="https://colab.research.google.com/..."
                value={itemForm.colabUrl}
                onChange={(e) => setItemForm({ ...itemForm, colabUrl: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lecture Notes PDF or Documentation URL</label>
            <input
              type="url"
              placeholder="https://arxiv.org/abs/... or PDF link"
              value={itemForm.notesPdfUrl}
              onChange={(e) => setItemForm({ ...itemForm, notesPdfUrl: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Learning Outcomes</label>
            <textarea
              required
              rows={3}
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <input
              type="checkbox"
              id="isFeatured"
              checked={itemForm.isFeatured}
              onChange={(e) => setItemForm({ ...itemForm, isFeatured: e.target.checked })}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="isFeatured" style={{ fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}>
              Feature this resource at the top of the Student Hub
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsItemModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Save Changes' : 'Publish Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
