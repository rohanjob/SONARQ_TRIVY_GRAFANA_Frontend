'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Load cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('ssp_cart') || '[]');
    setCartCount(cart.length);

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updated = JSON.parse(localStorage.getItem('ssp_cart') || '[]');
      setCartCount(updated.length);
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles['nav-inner']}>
        {/* Logo */}
        <Link href="/" className={styles['nav-logo']}>
          <div className={styles['nav-logo-icon']}>📚</div>
          <div className={styles['nav-logo-text']}>
            <span>SSP</span> Books
          </div>
        </Link>

        {/* Search */}
        <div className={styles['nav-search']}>
          <span className={styles['nav-search-icon']}>🔍</span>
          <input
            type="text"
            className={styles['nav-search-input']}
            placeholder="Search courses, topics, instructors..."
            id="nav-search"
          />
        </div>

        {/* Links */}
        <div className={styles['nav-links']}>
          <Link href="/" className={styles['nav-link']}>Home</Link>
          <Link href="/courses" className={styles['nav-link']}>Courses</Link>
          <Link href="/categories" className={styles['nav-link']}>Categories</Link>
        </div>

        {/* Cart */}
        <Link href="/cart" className={styles['nav-cart']} id="cart-btn">
          🛒
          {cartCount > 0 && (
            <span className={styles['nav-cart-badge']}>{cartCount}</span>
          )}
        </Link>

        {/* Auth */}
        <div className={styles['nav-auth']}>
          <Link href="/login" className="btn btn-outline btn-sm">Sign In</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>

        {/* Mobile Toggle */}
        <button className={styles['nav-toggle']} id="mobile-toggle">
          ☰
        </button>
      </div>
    </nav>
  );
}
