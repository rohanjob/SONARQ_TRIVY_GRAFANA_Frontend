'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('ssp_token', data.data.token);
        localStorage.setItem('ssp_user', JSON.stringify(data.data.user));
        window.location.href = '/';
      } else {
        setError(data.message || 'Login failed');
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

        <h1 className={styles['auth-title']}>Welcome Back</h1>
        <p className={styles['auth-subtitle']}>Sign in to continue your learning journey</p>

        {error && <div className={styles['auth-error']}>{error}</div>}

        <form className={styles['auth-form']} onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-lg ${styles['auth-submit']}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles['auth-divider']}>or</div>

        <div className={styles['auth-footer']}>
          Don&apos;t have an account? <Link href="/register">Sign up for free</Link>
        </div>
      </div>
    </div>
  );
}
