import React from 'react';
import { useClub } from '../../context/ClubContext';
import { UserPlus, CheckCircle2, XCircle, Clock } from 'lucide-react';

export function JoinRequests() {
  const { data, approveJoinRequest, rejectJoinRequest } = useClub();
  const requests = data.joinRequests || [];
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const pastRequests = requests.filter(r => r.status !== 'Pending');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Join Requests</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Approve or reject incoming membership applications.
          </p>
        </div>
        <div className="badge badge-amber" style={{ padding: '8px 12px' }}>
          <UserPlus size={16} />
          {pendingRequests.length} Pending
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Pending Approvals</h3>
        {pendingRequests.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>No pending join requests.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendingRequests.map(req => (
              <div key={req.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{req.name}</h4>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>{req.email}</span>
                    <span>•</span>
                    <span>{req.department || 'General'}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => rejectJoinRequest(req.id)}
                    className="btn btn-secondary" 
                    style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button 
                    onClick={() => approveJoinRequest(req.id)}
                    className="btn btn-primary"
                    style={{ background: '#10b981', color: 'white' }}
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Past Requests</h3>
        {pastRequests.length === 0 ? (
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No past requests.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {pastRequests.map(req => (
              <div key={req.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', opacity: 0.7 }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '2px' }}>{req.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{req.email}</span>
                </div>
                <span className={`badge ${req.status === 'Approved' ? 'badge-emerald' : 'badge-rose'}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
