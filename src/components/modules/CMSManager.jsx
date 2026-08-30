import React, { useState, useRef } from 'react';
import { useClub } from '../../context/ClubContext';
import { Modal } from '../layout/Modal';
import {
  Sparkles,
  Megaphone,
  BookOpen,
  FolderDown,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  Upload
} from 'lucide-react';

export function CMSManager() {
  const {
    data,
    updateHeroCMS,
    updateAboutCMS,
    updateFAQsCMS,
    updateFooterCMS,
    addAnnouncement,
    updateAnnouncement,
    toggleAnnouncementActive,
    deleteAnnouncement,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addResource,
    updateResource,
    deleteResource,
    setIsLivePreviewOpen,
    addToast
  } = useClub();

  const [activeSubTab, setActiveSubTab] = useState('hero'); // 'hero', 'announcements', 'blog', 'resources', 'faqs'

  // Hero form state
  const [heroForm, setHeroForm] = useState({
    slides: data.cmsPages?.hero?.slides || ['/slideshow/slide1.jpg', '/slideshow/slide2.jpg', '/slideshow/slide3.jpg'],
    ...(data.cmsPages?.hero || {})
  });
  const [newSlideUrl, setNewSlideUrl] = useState('');
  
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cms/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHeroForm((prev) => ({
          ...prev,
          slides: [...(prev.slides || []), data.url]
        }));
        addToast('Image uploaded successfully!', 'success');
      } else {
        addToast(data.error || 'Failed to upload image.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Network error during upload.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  // About form state
  const [aboutForm, setAboutForm] = useState(data.cmsPages?.about || {});
  // FAQs form state
  const [faqsList, setFaqsList] = useState(data.cmsPages?.faqs || []);
  
  // Footer form state
  const [footerForm, setFooterForm] = useState({
    links: data.cmsPages?.footer?.links || [
      { label: 'About Us', href: '#about' },
      { label: 'Workshops & Hackathons', href: '#events' },
      { label: 'Research Showcase', href: '#projects' },
      { label: 'Club FAQ', href: '#faq' }
    ]
  });
  const [newFooterLink, setNewFooterLink] = useState({ label: '', href: '' });

  // Announcement Modal
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [annFormData, setAnnFormData] = useState({
    title: '',
    content: '',
    urgency: 'Normal'
  });

  // Blog Modal
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    author: 'Aarav Sharma',
    category: 'Applied GenAI',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    excerpt: '',
    status: 'Published'
  });

  // Resource Modal
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resFormData, setResFormData] = useState({
    title: '',
    type: 'Curriculum Guide',
    size: 'PDF (3.5 MB)',
    domain: 'Foundational ML',
    link: '#'
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Content Management System (CMS)</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Dynamically customize site copy, broadcast announcements, publish blog posts, and manage learning resources
            </p>
          </div>

          <button
            onClick={() => setIsLivePreviewOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem' }}
          >
            <Eye size={16} />
            <span>Preview Live Site</span>
          </button>
        </div>

        {/* Sub Navigation Switcher */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', overflowX: 'auto' }}>
          {[
            { id: 'hero', label: 'Landing Hero & Copy', icon: Sparkles },
            { id: 'announcements', label: 'Site Announcements', icon: Megaphone, count: data.announcements?.length },
            { id: 'blog', label: 'Blog & Articles', icon: BookOpen, count: data.blogPosts?.length },
            { id: 'resources', label: 'Resource Hub', icon: FolderDown, count: data.resources?.length },
            { id: 'faqs', label: 'FAQ Manager', icon: HelpCircle, count: faqsList.length },
            { id: 'footer', label: 'Footer Links', icon: Plus, count: footerForm.links.length },
          ].map((sub) => {
            const Icon = sub.icon;
            const isActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--cyan-soft)' : 'transparent',
                  color: isActive ? '#0891b2' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                <span>{sub.label}</span>
                {sub.count !== undefined && (
                  <span style={{ fontSize: '0.72rem', padding: '1px 6px', borderRadius: '999px', background: isActive ? '#a5f3fc' : '#f1f5f9', color: '#0f172a' }}>
                    {sub.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: HERO & ABOUT COPY */}
      {activeSubTab === 'hero' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* Hero Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Hero Section Customizer</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Main headline, badge tag, and value proposition on the club landing page
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateHeroCMS(heroForm);
              }}
            >
              <div className="form-group">
                <label className="form-label">Hero Badge Tag</label>
                <input
                  type="text"
                  value={heroForm.badge}
                  onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Main Headline Title</label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Supporting Subtitle</label>
                <textarea
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Primary CTA Button</label>
                  <input
                    type="text"
                    value={heroForm.ctaPrimary}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaPrimary: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Secondary CTA Button</label>
                  <input
                    type="text"
                    value={heroForm.ctaSecondary}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaSecondary: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Background Slideshow Images (High Quality 4k/8k Recommended)</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={newSlideUrl}
                    onChange={(e) => setNewSlideUrl(e.target.value)}
                    placeholder="Enter image URL (e.g. https://images.unsplash.com/photo-...)"
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      if (newSlideUrl.trim()) {
                        setHeroForm({ ...heroForm, slides: [...heroForm.slides, newSlideUrl.trim()] });
                        setNewSlideUrl('');
                      }
                    }}
                  >
                    <Plus size={16} /> Add URL
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Upload size={16} />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(heroForm.slides || []).map((slide, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={slide} alt={`Slide ${idx + 1}`} style={{ width: '40px', height: '24px', objectFit: 'cover', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {slide}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-icon"
                        style={{ color: '#f43f5e' }}
                        onClick={() => {
                          setHeroForm({ ...heroForm, slides: heroForm.slides.filter((_, i) => i !== idx) });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                <CheckCircle2 size={16} />
                <span>Save Hero Changes</span>
              </button>
            </form>
          </div>

          {/* About Section Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>About & Mission Copy</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              The narrative, founding philosophy, and key impact statistics
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateAboutCMS(aboutForm);
              }}
            >
              <div className="form-group">
                <label className="form-label">About Heading</label>
                <input
                  type="text"
                  value={aboutForm.heading}
                  onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Club Narrative & Purpose</label>
                <textarea
                  value={aboutForm.narrative}
                  onChange={(e) => setAboutForm({ ...aboutForm, narrative: e.target.value })}
                  className="form-textarea"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Milestones & Highlight Metric</label>
                <input
                  type="text"
                  value={aboutForm.statsHighlight}
                  onChange={(e) => setAboutForm({ ...aboutForm, statsHighlight: e.target.value })}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                <CheckCircle2 size={16} />
                <span>Save About Content</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ANNOUNCEMENTS */}
      {activeSubTab === 'announcements' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Pinned Site Header Banners & Notices
            </span>
            <button
              onClick={() => {
                setEditingAnnouncement(null);
                setAnnFormData({ title: '', content: '', urgency: 'Normal' });
                setIsAnnModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Create Announcement</span>
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {(data.announcements || []).map((ann) => (
              <div
                key={ann.id}
                className="glass-panel"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderLeft: `4px solid ${ann.isActive ? 'var(--cyan-accent)' : '#cbd5e1'}`
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ann.title}</span>
                    <span className={`badge ${ann.urgency === 'High' ? 'badge-rose' : 'badge-cyan'}`}>
                      {ann.urgency}
                    </span>
                    <span className={`badge ${ann.isActive ? 'badge-emerald' : 'badge-gray'}`}>
                      {ann.isActive ? 'Active on Site' : 'Hidden'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {ann.content}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => toggleAnnouncementActive(ann.id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    {ann.isActive ? 'Hide Banner' : 'Publish Banner'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingAnnouncement(ann);
                      setAnnFormData({ title: ann.title, content: ann.content, urgency: ann.urgency });
                      setIsAnnModalOpen(true);
                    }}
                    className="btn-icon"
                    style={{ color: '#0ea5e9' }}
                    title="Edit Announcement"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="btn-icon"
                    style={{ color: '#f43f5e' }}
                    title="Delete Announcement"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: BLOG & ARTICLES */}
      {activeSubTab === 'blog' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Club Research Blog & Technical Articles
            </span>
            <button
              onClick={() => {
                setEditingBlog(null);
                setBlogFormData({
                  title: '',
                  author: 'Aarav Sharma',
                  category: 'Deep Learning',
                  readTime: '5 min read',
                  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                  excerpt: '',
                  status: 'Published'
                });
                setIsBlogModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Write Article</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {(data.blogPosts || []).map((post) => (
              <div
                key={post.id}
                className="glass-panel"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div style={{ height: '160px', width: '100%', position: 'relative' }}>
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '0.72rem',
                      fontWeight: 600
                    }}
                  >
                    {post.category}
                  </div>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      By {post.author} • {post.readTime}
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px', lineHeight: '1.4' }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {post.excerpt}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                    <span className="badge badge-emerald">{post.status}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setEditingBlog(post);
                          setBlogFormData(post);
                          setIsBlogModalOpen(true);
                        }}
                        className="btn-icon"
                        style={{ color: '#0ea5e9' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteBlogPost(post.id)} className="btn-icon" style={{ color: '#f43f5e' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: RESOURCE HUB */}
      {activeSubTab === 'resources' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Curated Study Guides, Datasets, and Model Checkpoints
            </span>
            <button
              onClick={() => {
                setEditingResource(null);
                setResFormData({
                  title: '',
                  type: 'Curriculum Guide',
                  size: 'PDF (3.5 MB)',
                  domain: 'Foundational ML',
                  link: '#'
                });
                setIsResModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Add Resource</span>
            </button>
          </div>

          <div className="custom-table-container glass-panel">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Resource Title & Description</th>
                  <th>Category</th>
                  <th>Format / Size</th>
                  <th>Track</th>
                  <th>Downloads</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data.resources || []).map((res) => (
                  <tr key={res.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{res.title}</div>
                    </td>
                    <td><span className="badge badge-cyan">{res.type}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.size}</td>
                    <td><span className="badge badge-lavender">{res.domain}</span></td>
                    <td style={{ fontWeight: 600 }}>{res.downloads}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setEditingResource(res);
                            setResFormData(res);
                            setIsResModalOpen(true);
                          }}
                          className="btn-icon"
                          style={{ color: '#0ea5e9' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteResource(res.id)} className="btn-icon" style={{ color: '#f43f5e' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 5: FAQS */}
      {activeSubTab === 'faqs' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Frequently Asked Questions (Public Q&A)
            </span>
            <button
              onClick={() => {
                const updated = [...faqsList, { question: 'New Question?', answer: 'Answer description...' }];
                setFaqsList(updated);
                updateFAQsCMS(updated);
              }}
              className="btn btn-secondary"
            >
              <Plus size={16} />
              <span>Add FAQ Item</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqsList.map((faq, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--cyan-accent)' }}>
                    Question #{idx + 1}
                  </span>
                  <button
                    onClick={() => {
                      const updated = faqsList.filter((_, i) => i !== idx);
                      setFaqsList(updated);
                      updateFAQsCMS(updated);
                    }}
                    className="btn-icon"
                    style={{ color: '#f43f5e', padding: '4px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...faqsList];
                    updated[idx].question = e.target.value;
                    setFaqsList(updated);
                  }}
                  onBlur={() => updateFAQsCMS(faqsList)}
                  className="form-input"
                  style={{ marginBottom: '8px', fontWeight: 600 }}
                  placeholder="Enter Question..."
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...faqsList];
                    updated[idx].answer = e.target.value;
                    setFaqsList(updated);
                  }}
                  onBlur={() => updateFAQsCMS(faqsList)}
                  className="form-textarea"
                  style={{ minHeight: '60px' }}
                  placeholder="Enter Answer..."
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: FOOTER LINKS */}
      {activeSubTab === 'footer' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Footer Quick Links
            </span>
            <button
              onClick={() => {
                if (newFooterLink.label && newFooterLink.href) {
                  const updatedLinks = [...footerForm.links, newFooterLink];
                  setFooterForm({ ...footerForm, links: updatedLinks });
                  updateFooterCMS({ links: updatedLinks });
                  setNewFooterLink({ label: '', href: '' });
                }
              }}
              className="btn btn-secondary"
            >
              <Plus size={16} />
              <span>Add Link</span>
            </button>
          </div>

          {/* Add New Link Inputs */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Link Label</label>
              <input
                type="text"
                placeholder="e.g. Documentation"
                value={newFooterLink.label}
                onChange={(e) => setNewFooterLink({ ...newFooterLink, label: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>URL / HREF</label>
              <input
                type="text"
                placeholder="e.g. https://docs.example.com or #about"
                value={newFooterLink.href}
                onChange={(e) => setNewFooterLink({ ...newFooterLink, href: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {footerForm.links.map((link, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%' }}>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...footerForm.links];
                      updated[idx].label = e.target.value;
                      setFooterForm({ ...footerForm, links: updated });
                    }}
                    onBlur={() => updateFooterCMS({ links: footerForm.links })}
                    className="form-input"
                    style={{ flex: 1, padding: '6px 12px' }}
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => {
                      const updated = [...footerForm.links];
                      updated[idx].href = e.target.value;
                      setFooterForm({ ...footerForm, links: updated });
                    }}
                    onBlur={() => updateFooterCMS({ links: footerForm.links })}
                    className="form-input"
                    style={{ flex: 2, padding: '6px 12px' }}
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = footerForm.links.filter((_, i) => i !== idx);
                    setFooterForm({ ...footerForm, links: updated });
                    updateFooterCMS({ links: updated });
                  }}
                  className="btn-icon"
                  style={{ color: '#f43f5e', padding: '8px', marginLeft: '12px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      <Modal
        isOpen={isAnnModalOpen}
        onClose={() => setIsAnnModalOpen(false)}
        title={editingAnnouncement ? "Edit Announcement Banner" : "Create Site Announcement Banner"}
        subtitle="This notice will appear at the very top of the club website"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editingAnnouncement) {
              updateAnnouncement(editingAnnouncement.id, annFormData);
            } else {
              addAnnouncement(annFormData);
            }
            setIsAnnModalOpen(false);
          }}
        >
          <div className="form-group">
            <label className="form-label">Announcement Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Applications Open for AI Cohort"
              value={annFormData.title}
              onChange={(e) => setAnnFormData({ ...annFormData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Urgency / Priority</label>
            <select
              value={annFormData.urgency}
              onChange={(e) => setAnnFormData({ ...annFormData, urgency: e.target.value })}
              className="form-select"
            >
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Notice Content *</label>
            <textarea
              required
              rows={3}
              placeholder="Write the banner message details..."
              value={annFormData.content}
              onChange={(e) => setAnnFormData({ ...annFormData, content: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsAnnModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAnnouncement ? "Update Announcement" : "Publish Announcement"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Blog Article Modal */}
      <Modal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        title={editingBlog ? 'Edit Blog Article' : 'Write Research Blog Article'}
        subtitle="Share technical insights and project deep dives with the community"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editingBlog) {
              updateBlogPost(editingBlog.id, blogFormData);
            } else {
              addBlogPost(blogFormData);
            }
            setIsBlogModalOpen(false);
          }}
        >
          <div className="form-group">
            <label className="form-label">Article Title *</label>
            <input
              type="text"
              required
              value={blogFormData.title}
              onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Author Name</label>
              <input
                type="text"
                value={blogFormData.author}
                onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                value={blogFormData.category}
                onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input
              type="url"
              value={blogFormData.coverImage}
              onChange={(e) => setBlogFormData({ ...blogFormData, coverImage: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Article Summary / Excerpt</label>
            <textarea
              required
              rows={4}
              value={blogFormData.excerpt}
              onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsBlogModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingBlog ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Resource Modal */}
      <Modal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
        title={editingResource ? "Edit Learning Resource" : "Add Learning Resource / Dataset"}
        subtitle="Provide study materials and code repos for club members"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editingResource) {
              updateResource(editingResource.id, resFormData);
            } else {
              addResource(resFormData);
            }
            setIsResModalOpen(false);
          }}
        >
          <div className="form-group">
            <label className="form-label">Resource Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. PyTorch Distributed Training Cheatsheet"
              value={resFormData.title}
              onChange={(e) => setResFormData({ ...resFormData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Type / Category</label>
              <select
                value={resFormData.type}
                onChange={(e) => setResFormData({ ...resFormData, type: e.target.value })}
                className="form-select"
              >
                <option value="Curriculum Guide">Curriculum Guide</option>
                <option value="Code Cheatsheet">Code Cheatsheet</option>
                <option value="Dataset">Dataset</option>
                <option value="Model Checkpoint">Model Checkpoint</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Domain Track</label>
              <input
                type="text"
                placeholder="MLOps / Vision / LLMs"
                value={resFormData.domain}
                onChange={(e) => setResFormData({ ...resFormData, domain: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Format or File Size</label>
            <input
              type="text"
              placeholder="PDF (4.2 MB) / HuggingFace Repo"
              value={resFormData.size}
              onChange={(e) => setResFormData({ ...resFormData, size: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsResModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingResource ? 'Save Changes' : 'Add Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
