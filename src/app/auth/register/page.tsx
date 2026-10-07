"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    regNumber: "",
    school: "",
    yearOfStudy: "1",
    county: "",
    subcounty: "",
    securityAnswer1: "",
    securityAnswer2: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      router.push('/auth/login?registered=true');
    } catch (err) {
      setError("Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-bg-alt)", padding: "clamp(1.5rem, 4vw, 3rem) 1rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <div className="card-body" style={{ padding: "clamp(1.25rem, 4vw, 2.5rem)" }}>
          <div className="text-center" style={{ marginBottom: "var(--space-6)" }}>
            <h1 style={{ marginBottom: "var(--space-2)" }}>Join GUSA</h1>
            <p>Create your student membership account</p>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: "var(--color-error-light)", 
              color: "var(--color-error)", 
              padding: "var(--space-3)", 
              borderRadius: "var(--radius-md)", 
              marginBottom: "var(--space-4)",
              fontSize: "var(--text-sm)"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-col gap-4">
            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="john@student.meru.ac.ke"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="07XX XXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="regNumber">Registration Number</label>
                <input
                  id="regNumber"
                  name="regNumber"
                  type="text"
                  className="form-input"
                  placeholder="CTXXX/XXXX/XXXX"
                  value={formData.regNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="yearOfStudy">Year of Study</label>
                <select
                  id="yearOfStudy"
                  name="yearOfStudy"
                  className="form-input"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                  <option value="5">Year 5</option>
                  <option value="6">Year 6</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="school">School / Department</label>
              <select
                id="school"
                name="school"
                className="form-input"
                value={formData.school}
                onChange={handleChange}
                required
              >
                <option value="">Select School</option>
                <option value="computing">School of Computing and Informatics</option>
                <option value="business">School of Business and Economics</option>
                <option value="engineering">School of Engineering and Architecture</option>
                <option value="health">School of Health Sciences</option>
                <option value="education">School of Education</option>
                <option value="agriculture">School of Agriculture and Food Science</option>
              </select>
            </div>

            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="county">Home County (Gusii)</label>
                <select
                  id="county"
                  name="county"
                  className="form-input"
                  value={formData.county}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select County</option>
                  <option value="kisii">Kisii County</option>
                  <option value="nyamira">Nyamira County</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subcounty">Sub-County</label>
                <input
                  id="subcounty"
                  name="subcounty"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kitutu Chache"
                  value={formData.subcounty}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "var(--radius-md)", background: "rgba(139,92,246,0.05)" }}>
              <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-3)", color: "var(--color-text-main)" }}>🔒 Security Verification</p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>Answer both questions correctly to complete registration.</p>

              <div style={{ marginBottom: "var(--space-3)" }}>
                <label className="form-label" htmlFor="securityAnswer1">Naki ase chiombe chikolala akorokwa?</label>
                <input
                  id="securityAnswer1"
                  name="securityAnswer1"
                  type="text"
                  className="form-input"
                  placeholder="Your answer..."
                  value={formData.securityAnswer1}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="securityAnswer2">eyemo omente eyemo = ?</label>
                <input
                  id="securityAnswer2"
                  name="securityAnswer2"
                  type="text"
                  className="form-input"
                  placeholder="Your answer..."
                  value={formData.securityAnswer2}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
              style={{ width: "100%", marginTop: "var(--space-4)" }}
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="text-center" style={{ marginTop: "var(--space-6)", fontSize: "var(--text-sm)" }}>
            <span style={{ color: "var(--color-text-muted)" }}>Already have an account? </span>
            <Link href="/auth/login" style={{ fontWeight: "var(--weight-semibold)" }}>
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
