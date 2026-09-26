"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSaving(false);
    setSuccessMsg("Profile updated successfully!");
    
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="container" style={{ paddingBlock: "var(--space-8)" }}>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Link href="/dashboard" style={{ display: "inline-block", marginBottom: "var(--space-4)", fontSize: "var(--text-sm)" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>Edit Profile</h1>
        <p>Update your personal information and account settings.</p>
      </div>

      {successMsg && (
        <div style={{ 
          backgroundColor: "var(--color-success-light)", 
          color: "var(--color-success)", 
          padding: "var(--space-3)", 
          borderRadius: "var(--radius-md)", 
          marginBottom: "var(--space-6)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-medium)"
        }}>
          {successMsg}
        </div>
      )}

      <div className="card">
        <div className="tabs" style={{ padding: "0 var(--space-4)", backgroundColor: "var(--color-bg-alt)" }}>
          <button 
            className={`tab ${activeTab === "personal" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Info
          </button>
          <button 
            className={`tab ${activeTab === "contacts" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            Contacts & Emergency
          </button>
          <button 
            className={`tab ${activeTab === "security" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        <div className="card-body" style={{ padding: "var(--space-6)" }}>
          <form onSubmit={handleSave}>
            {activeTab === "personal" && (
              <div className="flex-col gap-6">
                <h3 style={{ fontSize: "var(--text-xl)", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "var(--space-2)" }}>Basic Information</h3>
                
                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" defaultValue="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Registration Number</label>
                    <input type="text" className="form-input" defaultValue="CTXXX/1234/2021" disabled style={{ backgroundColor: "var(--color-gray-100)" }} />
                  </div>
                </div>

                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">School / Department</label>
                    <select className="form-input" defaultValue="computing">
                      <option value="computing">School of Computing and Informatics</option>
                      <option value="business">School of Business and Economics</option>
                      <option value="engineering">School of Engineering and Architecture</option>
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

                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Home County</label>
                    <select className="form-input" defaultValue="kisii">
                      <option value="kisii">Kisii County</option>
                      <option value="nyamira">Nyamira County</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sub-County</label>
                    <input type="text" className="form-input" defaultValue="Kitutu Chache" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contacts" && (
              <div className="flex-col gap-6">
                <h3 style={{ fontSize: "var(--text-xl)", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "var(--space-2)" }}>Contact Information</h3>
                
                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" defaultValue="john@student.meru.ac.ke" disabled style={{ backgroundColor: "var(--color-gray-100)" }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" defaultValue="0712 345 678" />
                  </div>
                </div>

                <h3 style={{ fontSize: "var(--text-xl)", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "var(--space-2)", marginTop: "var(--space-4)" }}>Emergency Contact</h3>
                
                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Contact Name</label>
                    <input type="text" className="form-input" defaultValue="Jane Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Relationship</label>
                    <input type="text" className="form-input" defaultValue="Mother" />
                  </div>
                </div>
                
                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Emergency Phone Number</label>
                    <input type="tel" className="form-input" defaultValue="0722 000 111" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="flex-col gap-6">
                <h3 style={{ fontSize: "var(--text-xl)", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "var(--space-2)" }}>Change Password</h3>
                
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" placeholder="Enter current password" />
                </div>
                
                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" placeholder="Enter new password" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-input" placeholder="Confirm new password" />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: "var(--space-8)", display: "flex", justifyContent: "flex-end", gap: "var(--space-4)", borderTop: "1px solid var(--color-border-light)", paddingTop: "var(--space-4)" }}>
              <button type="button" className="btn btn-ghost" onClick={() => window.history.back()}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
