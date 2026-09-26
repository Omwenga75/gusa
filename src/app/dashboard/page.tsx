import React from "react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container" style={{ paddingBlock: "var(--space-8)" }}>
      {/* Header Section */}
      <div className="flex justify-between items-center flex-wrap gap-4" style={{ marginBottom: "var(--space-8)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>Member Dashboard</h1>
          <p>Welcome back, John Doe. Here is what is happening in GUSA.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge badge-success" style={{ fontSize: "var(--text-sm)", padding: "var(--space-2) var(--space-4)" }}>
            Active Member
          </span>
          <Link href="/dashboard/profile" className="btn btn-outline">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-6)" }}>
        
        {/* Profile Overview Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center gap-4" style={{ marginBottom: "var(--space-4)" }}>
              <div className="avatar avatar-xl">
                JD
              </div>
              <div>
                <h3 className="card-title" style={{ marginBottom: "0" }}>John Doe</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>CTXXX/1234/2021</p>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-primary)", fontWeight: "var(--weight-medium)" }}>Year 3 • School of Computing</p>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "var(--space-4)" }}>
              <div className="flex justify-between" style={{ marginBottom: "var(--space-2)" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>County:</span>
                <span style={{ fontWeight: "var(--weight-medium)" }}>Kisii</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: "var(--space-2)" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Membership:</span>
                <span style={{ fontWeight: "var(--weight-medium)" }}>Paid (Valid till May 2026)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-text" style={{ marginBottom: "var(--space-4)" }}>Common tasks and requests.</p>
            
            <div className="flex-col gap-3">
              <Link href="/dashboard/events" className="btn btn-primary" style={{ width: "100%", justifyContent: "flex-start" }}>
                Browse Upcoming Events
              </Link>
              <Link href="/dashboard/welfare" className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start" }}>
                Request Welfare Support
              </Link>
              <Link href="/dashboard/dues" className="btn btn-outline" style={{ width: "100%", justifyContent: "flex-start" }}>
                Pay Semester Dues
              </Link>
            </div>
          </div>
        </div>

        {/* Registered Events Status */}
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">My Events</h3>
            <p className="card-text" style={{ marginBottom: "var(--space-4)" }}>Your upcoming registered events.</p>
            
            <div className="flex-col gap-4">
              <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-bg-alt)" }}>
                <div className="flex justify-between items-start" style={{ marginBottom: "var(--space-2)" }}>
                  <h4 style={{ fontSize: "var(--text-base)" }}>Annual Cultural Night</h4>
                  <span className="badge badge-primary">Upcoming</span>
                </div>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Oct 12, 2026 • MUST Main Hall</p>
              </div>

              <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-bg-alt)" }}>
                <div className="flex justify-between items-start" style={{ marginBottom: "var(--space-2)" }}>
                  <h4 style={{ fontSize: "var(--text-base)" }}>Freshers Welcome Party</h4>
                  <span className="badge badge-neutral">Attended</span>
                </div>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Sep 10, 2026 • Student Centre</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welfare Benefit Requests */}
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Welfare Requests</h3>
            <p className="card-text" style={{ marginBottom: "var(--space-4)" }}>Status of your recent welfare applications.</p>
            
            <div className="flex-col gap-4">
              <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)" }}>
                <div className="flex justify-between items-start" style={{ marginBottom: "var(--space-2)" }}>
                  <h4 style={{ fontSize: "var(--text-base)" }}>Medical Support</h4>
                  <span className="badge badge-warning">Pending</span>
                </div>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Submitted on Sep 20, 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-body">
            <h3 className="card-title">Recent Announcements</h3>
            <div className="table-wrapper" style={{ marginTop: "var(--space-4)" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Announcement</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sep 24, 2026</td>
                    <td><strong style={{ color: "var(--color-text)" }}>Election Timetable Released</strong> - The electoral commission has released dates for the upcoming GUSA elections.</td>
                    <td><span className="badge badge-info">Elections</span></td>
                    <td><Link href="#" className="btn btn-sm btn-ghost">Read</Link></td>
                  </tr>
                  <tr>
                    <td>Sep 18, 2026</td>
                    <td><strong style={{ color: "var(--color-text)" }}>Semester Registration Deadline</strong> - Please ensure you clear your semester dues before the 30th.</td>
                    <td><span className="badge badge-warning">Admin</span></td>
                    <td><Link href="#" className="btn btn-sm btn-ghost">Read</Link></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
