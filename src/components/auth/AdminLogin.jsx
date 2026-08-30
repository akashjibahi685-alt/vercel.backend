import React, { useState } from 'react';
import { useClub } from '../../context/ClubContext';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  X,
  Sparkles,
  UserCheck,
  UserPlus,
  LogIn,
  Key,
  GraduationCap
} from 'lucide-react';

export function AdminLogin({ onClose }) {
  const { login, registerAdmin, data } = useClub();

  // 'student' or 'admin'
  const [authMode, setAuthMode] = useState('student');
  // 'login' or 'register' (Register only available in Admin mode)
  const [activeTab, setActiveTab] = useState('login'); 

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form State (Admin Only)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDepartment] = useState('AI & Machine Learning');
  const [regRole, setRegRole] = useState('Admin');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    const res = await login(loginEmail, loginPassword);
    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
    } else if (onClose) {
      onClose();
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    
    if (authMode === 'admin' && !adminSecretKey) {
      setErrorMsg('Admin Verification Key is required for staff accounts.');
      return;
    }

    setIsLoading(true);
    const res = await registerAdmin({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      department: regDepartment,
      adminSecretKey: adminSecretKey
    });
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed.');
    } else if (onClose) {
      onClose();
    }
  };

  // Quick 1-Click Login Helper (dev/demo mode only)
  const DEMO_CREDENTIALS = [
    { email: 'admin@axion-aiml.club',  password: 'admin',  label: 'Aarav (Admin)' },
    { email: 'mentor@axion-aiml.club', password: 'mentor', label: 'Elena (Mentor)' },
    { email: 'lead@axion-aiml.club',   password: 'lead',   label: 'Sophia (Lead)' },
  ];

  const handleQuickLogin = async (userEmail, userPass) => {
    setLoginEmail(userEmail);
    setLoginPassword(userPass);
    setErrorMsg('');
    setIsLoading(true);
    const res = await login(userEmail, userPass);
    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.error);
    } else if (onClose) {
      onClose();
    }
  };
  const memberAccounts = data.members || [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <div
        className="glass-panel animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '32px 28px',
          position: 'relative',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border-glass)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ position: 'absolute', top: '16px', right: '16px' }}
            title="Return to Public Site"
          >
            <X size={18} />
          </button>
        )}

        {/* Auth Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '100px', padding: '4px' }}>
            <button
              onClick={() => { setAuthMode('student'); setActiveTab('login'); setErrorMsg(''); }}
              style={{
                padding: '8px 24px',
                borderRadius: '100px',
                border: 'none',
                background: authMode === 'student' ? 'white' : 'transparent',
                color: authMode === 'student' ? 'var(--cyan-accent)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: authMode === 'student' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <GraduationCap size={16} />
              Student Access
            </button>
            <button
              onClick={() => { setAuthMode('admin'); setErrorMsg(''); }}
              style={{
                padding: '8px 24px',
                borderRadius: '100px',
                border: 'none',
                background: authMode === 'admin' ? 'white' : 'transparent',
                color: authMode === 'admin' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: authMode === 'admin' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <ShieldCheck size={16} />
              Admin Access
            </button>
          </div>
        </div>

        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
            <img
              src="/axion_logo.jpg"
              alt="AXION Emblem"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: authMode === 'student' ? '0 0 20px rgba(6, 182, 212, 0.4)' : '0 0 20px rgba(79, 70, 229, 0.4)',
                border: `2px solid ${authMode === 'student' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(79, 70, 229, 0.3)'}`
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                background: authMode === 'student' ? '#0ea5e9' : '#4f46e5',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                border: '2px solid white'
              }}
            >
              {authMode === 'student' ? <UserCheck size={11} /> : <Lock size={11} />}
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '2px' }}>
            {authMode === 'student' ? 'AXION Member Portal' : 'AXION Control Center'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {authMode === 'student' ? 'Welcome back! Log in to access your dashboard.' : 'Authorized Staff & Administrator Portal Access'}
          </p>
        </div>

        {/* Admin Register/Login Switcher */}
        {authMode === 'admin' && (
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: 'var(--radius-md)',
              padding: '4px',
              marginBottom: '20px',
              border: '1px solid var(--border-light)'
            }}
          >
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'login' ? 'white' : 'transparent',
                color: activeTab === 'login' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'login' ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: activeTab === 'login' ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <LogIn size={15} />
              <span>Staff Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'register' ? 'white' : 'transparent',
                color: activeTab === 'register' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'register' ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: activeTab === 'register' ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <UserPlus size={15} />
              <span>Register Admin</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              background: '#fef2f2',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginBottom: '20px',
              border: '1px solid #fecaca'
            }}
          >
            <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ lineHeight: '1.4' }}>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="form-control"
                  placeholder="name@example.com"
                  style={{ paddingLeft: '40px', background: 'white' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="input-with-icon">
                <KeyRound className="input-icon" size={18} />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="form-control"
                  placeholder="••••••••"
                  style={{ paddingLeft: '40px', paddingRight: '40px', background: 'white' }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !loginEmail || !loginPassword}
              className="btn btn-primary"
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '12px',
                fontWeight: 600,
                fontSize: '0.95rem',
                justifyContent: 'center',
                background: authMode === 'student' ? 'var(--cyan-accent)' : 'var(--primary)',
                color: authMode === 'student' ? 'black' : 'white'
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} className="animate-pulse" /> Authenticating...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LogIn size={18} /> Sign In
                </span>
              )}
            </button>

            {/* Quick Demo Logins (Dev/Testing Only — remove in production) */}
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
                Quick Login (Demo Only)
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {authMode === 'admin' ? (
                  DEMO_CREDENTIALS.map((cred) => (
                    <button
                      key={cred.email}
                      type="button"
                      onClick={() => handleQuickLogin(cred.email, cred.password)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        background: '#f8fafc',
                        border: '1px solid var(--border-light)',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'var(--primary-light)';
                        e.currentTarget.style.color = 'var(--primary)';
                        e.currentTarget.style.borderColor = 'var(--primary)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                      }}
                    >
                      {cred.label}
                    </button>
                  ))
                ) : (
                  memberAccounts.slice(0, 4).map((u) => (
                    <button
                      key={u.email}
                      type="button"
                      onClick={() => handleQuickLogin(u.email, 'member123')}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        background: '#f8fafc',
                        border: '1px solid var(--border-light)',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#cffafe';
                        e.currentTarget.style.color = '#0891b2';
                        e.currentTarget.style.borderColor = '#0891b2';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                      }}
                    >
                      {u.name.split(' ')[0]} (Member)
                    </button>
                  ))
                )}
              </div>
            </div>
          </form>
        ) : (
          /* ADMIN REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="form-control"
                  style={{ background: 'white' }}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Email *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="form-control"
                  style={{ background: 'white' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Password *</label>
                <div className="input-with-icon">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="form-control"
                    style={{ paddingRight: '36px', background: 'white' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                  >
                    {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Confirm *</label>
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="form-control"
                  style={{ background: 'white' }}
                />
              </div>
            </div>

            {authMode === 'admin' ? (
              <>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Staff Role *</label>
                  <select
                    className="form-control"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    style={{ background: 'white' }}
                  >
                    <option value="Admin">Administrator</option>
                    <option value="Core Lead">Core Lead</option>
                    <option value="Faculty Advisor">Faculty Advisor</option>
                    <option value="Event Coordinator">Event Coordinator</option>
                  </select>
                </div>

                <div
                  style={{
                    marginTop: '4px',
                    padding: '12px',
                    background: '#eff6ff',
                    borderRadius: '8px',
                    border: '1px dashed #bfdbfe'
                  }}
                >
                  <label className="form-label" style={{ fontSize: '0.8rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={14} /> Admin Verification Key
                  </label>
                  <input
                    type="password"
                    required={authMode === 'admin'}
                    value={adminSecretKey}
                    onChange={(e) => setAdminSecretKey(e.target.value)}
                    placeholder="Enter root access passkey"
                    className="form-control"
                    style={{
                      background: 'white',
                      borderColor: '#bfdbfe',
                      color: '#1e40af',
                      fontWeight: 600
                    }}
                  />
                  <p style={{ fontSize: '0.7rem', color: '#3b82f6', marginTop: '6px', marginBottom: 0 }}>
                    Required to create a new administrative account. Contact Head Administrator for the key.
                  </p>
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Role</label>
                <div className="form-control" style={{ background: '#f8fafc', color: 'var(--text-secondary)' }}>
                  Student Member
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !regName || !regEmail || !regPassword || (authMode === 'admin' && !adminSecretKey)}
              className="btn btn-primary"
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '12px',
                fontWeight: 600,
                fontSize: '0.95rem',
                justifyContent: 'center'
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} className="animate-pulse" /> Registering...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserPlus size={18} /> Create Staff Account
                </span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
