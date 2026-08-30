import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useClub } from '../../context/ClubContext';
import { Modal } from '../layout/Modal';
import {
  UserPlus,
  Search,
  Download,
  Edit2,
  Trash2,
  Key,
  BarChart2,
  Users,
  Award,
  Briefcase,
  GraduationCap,
  FileText as FileTextIcon,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export function MemberManager() {
  const { data, addMember, updateMember, deleteMember, globalSearch } = useClub();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Tabs
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'analytics'

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'totalScore', direction: 'desc' });

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/members/analytics');
      const data = await res.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error(err);
      // fallback error
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics' && analyticsData.length === 0) {
      const t = setTimeout(() => fetchAnalytics(), 0);
      return () => clearTimeout(t);
    }
  }, [activeTab, analyticsData.length, fetchAnalytics]);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAnalytics = useMemo(() => {
    let sortableItems = [...analyticsData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [analyticsData, sortConfig]);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Member',
    department: 'Computer Science',
    skills: 'PyTorch, Python, Scikit-Learn',
    github: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  });

  // Open add modal
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Member',
      department: 'Computer Science',
      skills: 'PyTorch, Python, Scikit-Learn',
      github: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      skills: (member.skills || []).join(', '),
      github: member.github || '',
      avatar: member.avatar,
      status: member.status
    });
  };

  // Save form
  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingMember) {
      updateMember(editingMember.id, {
        ...formData,
        skills: skillsArray
      });
      setEditingMember(null);
    } else {
      addMember({
        ...formData,
        skills: skillsArray
      });
      setIsAddModalOpen(false);
    }
  };

  const handleResetPassword = async (member) => {
    if (!member.userId) {
      addToast('Cannot reset password: This member has not registered an account yet.', 'error');
      return;
    }
    const newPassword = window.prompt(`Enter a new temporary password for ${member.name}:`);
    if (!newPassword) return;

    try {
      const res = await fetch(`/api/auth/admin/users/${member.userId}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(`Password for ${member.name} has been overridden!`, 'success');
      } else {
        addToast(data.error || 'Failed to override password', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('An error occurred while resetting password', 'error');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Role,Status,Department,JoinedDate,Skills\n';
    const rows = (data.members || [])
      .map(
        (m) =>
          `"${m.id}","${m.name}","${m.email}","${m.role}","${m.status}","${m.department}","${m.joinedDate}","${(
            m.skills || []
          ).join('; ')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axion_members_${Date.now()}.csv`;
    link.click();
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    const activeSearch = (searchQuery || globalSearch).toLowerCase();
    return (data.members || []).filter((member) => {
      const matchSearch =
        member.name.toLowerCase().includes(activeSearch) ||
        member.email.toLowerCase().includes(activeSearch) ||
        member.department.toLowerCase().includes(activeSearch) ||
        (member.skills || []).some((s) => s.toLowerCase().includes(activeSearch));

      const matchRole = selectedRole === 'All' || member.role === selectedRole;
      const matchStatus = selectedStatus === 'All' || member.status === selectedStatus;

      return matchSearch && matchRole && matchStatus;
    });
  }, [data.members, searchQuery, globalSearch, selectedRole, selectedStatus]);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return <span className="badge badge-rose">Admin</span>;
      case 'Core Lead':
        return <span className="badge badge-cyan">Core Lead</span>;
      case 'Club Mentor':
        return <span className="badge badge-lavender">Mentor</span>;
      case 'ML Researcher':
        return <span className="badge badge-blue">Researcher</span>;
      case 'Alumni':
        return <span className="badge badge-gray">Alumni</span>;
      default:
        return <span className="badge badge-emerald">Member</span>;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Toolbar */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Member Directory & Access Control</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Manage member roles, permissions, research tracks, and team assignments
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleExportCSV} className="btn btn-secondary" title="Export to CSV">
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            <button onClick={handleOpenAdd} className="btn btn-primary">
              <UserPlus size={16} />
              <span>Add Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('directory')}
          style={{
            padding: '14px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'directory' ? '3px solid var(--cyan-accent)' : '3px solid transparent',
            color: activeTab === 'directory' ? 'var(--cyan-accent)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Users size={18} /> Member Directory
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '14px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'analytics' ? '3px solid var(--amber)' : '3px solid transparent',
            color: activeTab === 'analytics' ? 'var(--amber)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <BarChart2 size={18} /> Student Analytics
        </button>
      </div>

      {activeTab === 'directory' && (
        <>
          {/* Filter Controls Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '18px',
            flexWrap: 'wrap'
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              placeholder="Search by name, email, department, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '34px', fontSize: '0.84rem' }}
            />
          </div>

          {/* Role Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '7px 12px', fontSize: '0.84rem' }}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Core Lead">Core Lead</option>
              <option value="Club Mentor">Club Mentor</option>
              <option value="ML Researcher">ML Researcher</option>
              <option value="Member">Member</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '7px 12px', fontSize: '0.84rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
        </div>

      {/* Members Table */}
      <div className="custom-table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Member Details</th>
              <th>Role & Permissions</th>
              <th>Department / Track</th>
              <th>Skills & Focus</th>
              <th>Joined Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={member.user?.avatarUrl || member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={member.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getRoleBadge(member.role)}</td>
                  <td>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{member.department}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '260px' }}>
                      {(member.skills || []).map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 500
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{member.joinedDate}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => handleResetPassword(member)}
                        className="btn-icon"
                        title="Override Password"
                        style={{ color: '#8b5cf6' }}
                      >
                        <Key size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="btn-icon"
                        title="Edit Member"
                        style={{ color: '#0ea5e9' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${member.name} from club directory?`)) {
                            deleteMember(member.id);
                          }
                        }}
                        className="btn-icon"
                        title="Delete Member"
                        style={{ color: '#f43f5e' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No members matched your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </>
      )}

      {activeTab === 'analytics' && (
        <div className="custom-table-container glass-panel">
          {analyticsLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading analytics...
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }} 
                    onClick={() => handleSort('totalScore')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Total Score {sortConfig.key === 'totalScore' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }} 
                    onClick={() => handleSort('achievements')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Achievements {sortConfig.key === 'achievements' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }} 
                    onClick={() => handleSort('internships')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Internships {sortConfig.key === 'internships' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }} 
                    onClick={() => handleSort('certificates')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Certificates {sortConfig.key === 'certificates' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }} 
                    onClick={() => handleSort('papers')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Research Papers {sortConfig.key === 'papers' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAnalytics.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={student.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{student.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.department}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-amber" style={{ fontSize: '1rem', padding: '6px 12px' }}>
                        {student.totalScore}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Award size={16} color="var(--amber)" />
                        <span style={{ fontWeight: 600 }}>{student.achievements}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Briefcase size={16} color="var(--rose)" />
                        <span style={{ fontWeight: 600 }}>{student.internships}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GraduationCap size={16} color="var(--emerald)" />
                        <span style={{ fontWeight: 600 }}>{student.certificates}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileTextIcon size={16} color="var(--lavender)" />
                        <span style={{ fontWeight: 600 }}>{student.papers}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedAnalytics.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No student data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add / Edit Member Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingMember}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMember(null);
        }}
        title={editingMember ? 'Edit Member Profile' : 'Register New Club Member'}
        subtitle="Manage member details, role assignment, and technical skills"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Lin"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Institutional Email *</label>
            <input
              type="email"
              required
              placeholder="maya.lin@axion-aiml.club"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Assigned Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-select"
              >
                <option value="Member">Member</option>
                <option value="ML Researcher">ML Researcher</option>
                <option value="Core Lead">Core Lead</option>
                <option value="Club Mentor">Club Mentor</option>
                <option value="Admin">Admin</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Department / Academic Track</label>
            <input
              type="text"
              placeholder="e.g. Computer Science, Robotics, Data Science"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skills (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. PyTorch, JAX, CUDA, Diffusion Models, OpenCV"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">GitHub Profile URL</label>
            <input
              type="url"
              placeholder="https://github.com/username"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingMember(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingMember ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
