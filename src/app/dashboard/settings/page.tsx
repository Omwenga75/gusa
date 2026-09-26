'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>Account Settings</h1>

      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-4)', 
        marginBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--color-border-light)'
      }}>
        {['profile', 'security', 'preferences'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: 'var(--space-3) var(--space-4)',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? '600' : '400',
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: '-1px',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          {activeTab === 'profile' && (
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" defaultValue="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" defaultValue="+254 712 345 678" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Course</label>
                <input type="text" className="form-input" defaultValue="BSc. Computer Science" />
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">School</label>
                  <select className="form-input" defaultValue="computing">
                    <option value="computing">School of Computing</option>
                    <option value="business">School of Business</option>
                    <option value="engineering">School of Engineering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <select className="form-input" defaultValue="3">
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-4)' }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" placeholder="Enter current password" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" placeholder="Confirm new password" />
              </div>

              <div style={{ marginTop: 'var(--space-4)' }}>
                <button type="submit" className="btn btn-primary">Update Password</button>
              </div>
            </form>
          )}

          {activeTab === 'preferences' && (
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--text-lg)' }}>Notification Settings</h3>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <input type="checkbox" defaultChecked />
                <span>Email Notifications for Important Announcements</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <input type="checkbox" defaultChecked />
                <span>Event Reminders (24 hours before)</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <input type="checkbox" />
                <span>Weekly News Digest</span>
              </label>

              <div style={{ marginTop: 'var(--space-4)' }}>
                <button type="submit" className="btn btn-primary">Save Preferences</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
