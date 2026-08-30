import React, { useState } from 'react';
import { useClub } from '../../context/ClubContext';
import { Modal } from '../layout/Modal';
import { GithubIcon } from '../common/Icons';
import {
  Plus,
  Star,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles
} from 'lucide-react';

// Category → fallback image map (local AI-generated images in /public)
const CATEGORY_IMAGES = {
  'Generative AI & LLMs': '/project_llm.jpg',
  'Generative AI': '/project_llm.jpg',
  'Computer Vision': '/project_vision.jpg',
  'Reinforcement Learning': '/project_rl.jpg',
  'Robotics & Control': '/project_robotics.jpg',
  'MLOps & Edge AI': '/project_neural.jpg',
  'Machine Learning': '/project_neural.jpg',
  'Web App': '/project_neural.jpg',
  'Hardware': '/project_robotics.jpg',
};

function getProjectImage(proj) {
  if (proj.image) return proj.image;
  return CATEGORY_IMAGES[proj.category] || '/project_neural.jpg';
}

export function ProjectShowcase() {
  const { data, addProject, updateProject, deleteProject } = useClub();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    authors: 'Sophia Chen, Aarav Sharma',
    category: 'Generative AI',
    status: 'Featured',
    stars: 120,
    github: 'https://github.com/axion-aiml',
    demoUrl: 'https://demo.axion-aiml.club',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    description: ''
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      authors: 'Member Authors',
      category: 'Computer Vision & Robotics',
      status: 'Approved',
      stars: 0,
      github: 'https://github.com/axion-aiml',
      demoUrl: '',
      image: '',
      description: 'Describe the neural network architecture, dataset, benchmarks, and real-world application...'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingProject(proj);
    setFormData({
      name: proj.name,
      authors: (proj.authors || []).join(', '),
      category: proj.category,
      status: proj.status,
      stars: proj.stars || 0,
      github: proj.github || '',
      demoUrl: proj.demoUrl || '',
      image: proj.image,
      description: proj.description
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const authorsArr = formData.authors
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    if (editingProject) {
      updateProject(editingProject.id, {
        ...formData,
        authors: authorsArr
      });
      setEditingProject(null);
    } else {
      addProject({
        ...formData,
        authors: authorsArr
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Bar */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Member AI & ML Project Showcase</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Curate, highlight, and review cutting-edge research projects and open-source models
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} />
            <span>Submit / Feature Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}
      >
        {(data.projects || []).map((proj) => (
          <div
            key={proj.id}
            className="glass-panel"
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Project Image */}
            <div style={{ height: '170px', width: '100%', position: 'relative' }}>
              <img
                src={getProjectImage(proj)}
                alt={proj.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = CATEGORY_IMAGES[proj.category] || '/project_neural.jpg';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '6px'
                }}
              >
                <span className={`badge ${proj.status === 'Featured' ? 'badge-cyan' : 'badge-emerald'}`}>
                  {proj.status === 'Featured' && <Sparkles size={12} />}
                  {proj.status}
                </span>
                <span className="badge badge-lavender">{proj.category}</span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>
                  {proj.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  By {(proj.authors || []).join(', ')}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                  {proj.description}
                </p>
              </div>

              <div>
                {/* Links & Metrics */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600 }}
                    >
                      <GithubIcon size={14} />
                      <span>Code Repo</span>
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--cyan-accent)', fontWeight: 600 }}
                    >
                      <ExternalLink size={14} />
                      <span>Live Demo</span>
                    </a>
                  )}
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>
                    <Star size={14} fill="#f59e0b" />
                    <span>{proj.stars || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="btn-icon"
                    title="Edit Project"
                    style={{ color: '#0ea5e9' }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove project "${proj.name}"?`)) {
                        deleteProject(proj.id);
                      }
                    }}
                    className="btn-icon"
                    title="Delete Project"
                    style={{ color: '#f43f5e' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingProject}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProject(null);
        }}
        title={editingProject ? 'Edit Project Showcase' : 'Feature New AI/ML Project'}
        subtitle="Highlight student research, neural models, and robotics implementations"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Authors / Team (Comma-separated)</label>
              <input
                type="text"
                required
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Domain Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                <option value="Generative AI & LLMs">Generative AI & LLMs</option>
                <option value="Computer Vision">Computer Vision</option>
                <option value="Reinforcement Learning">Reinforcement Learning</option>
                <option value="Robotics & Control">Robotics & Control</option>
                <option value="MLOps & Edge AI">MLOps & Edge AI</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-select"
              >
                <option value="Featured">Featured</option>
                <option value="Approved">Approved</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">GitHub Stars Count</label>
              <input
                type="number"
                value={formData.stars}
                onChange={(e) => setFormData({ ...formData, stars: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">GitHub Repository URL</label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Live Interactive Demo URL</label>
            <input
              type="url"
              placeholder="https://huggingface.co/spaces/..."
              value={formData.demoUrl}
              onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover / Screenshot URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Abstract & Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProject(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingProject ? 'Save Changes' : 'Publish Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
