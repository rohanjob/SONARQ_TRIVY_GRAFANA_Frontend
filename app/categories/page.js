'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fallbackCategories } from '../lib/fallbackData';
import styles from './page.module.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      setCategories(data.data || fallbackCategories);
    } catch {
      setCategories(fallbackCategories);
    }
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <main className={styles['categories-page']}>
        <div className="container">
          <div className={styles['page-header']}>
            <h1>📂 Course Categories</h1>
            <p>Explore our wide range of topics and find the perfect course for your goals</p>
          </div>

          {loading ? (
            <div className={styles['categories-grid']}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card" style={{ padding: '36px 28px', textAlign: 'center' }}>
                  <div className="skeleton" style={{ height: '48px', width: '48px', borderRadius: '50%', margin: '0 auto 16px' }} />
                  <div className="skeleton" style={{ height: '20px', width: '60%', margin: '0 auto 8px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '80%', margin: '0 auto' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles['categories-grid']}>
              {categories.map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  href={`/courses?category=${cat.slug}`}
                  className={styles['category-card']}
                >
                  <div className={styles['category-content']}>
                    <span className={styles['category-icon']}>{cat.icon}</span>
                    <div className={styles['category-name']}>{cat.name}</div>
                    <div className={styles['category-desc']}>{cat.description}</div>
                    <div className={styles['category-count']}>{cat.course_count || 0} courses available</div>
                    <div className={styles['category-arrow']}>Explore Courses →</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
