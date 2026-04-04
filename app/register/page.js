'use client';

import { useState } from 'react';
import Link from 'next/link';
import { API_BASE } from '../lib/api';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('ssp_token', data.data.token);
        localStorage.setItem('ssp_user', JSON.stringify(data.data.user));
        window.location.href = '/';
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Unable to connect to server. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className={styles['auth-page']}>
      <div className={styles['auth-bg']} />
      <div className={styles['auth-card']}>
        <Link href="/" className={styles['auth-logo']}>
          <div className={styles['auth-logo-icon']}>📚</div>
          <span>SSP</span> Books
        </Link>

        <h1 className={styles['auth-title']}>Create Account</h1>
        <p className={styles['auth-subtitle']}>Start your learning journey for free</p>

        {error && <div className={styles['auth-error']}>{error}</div>}

        <form className={styles['auth-form']} onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              className="input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              className="input"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-lg ${styles['auth-submit']}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Free Account'}
          </button>
        </form>

        <div className={styles['auth-divider']}>or</div>

        <div className={styles['auth-footer']}>
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
