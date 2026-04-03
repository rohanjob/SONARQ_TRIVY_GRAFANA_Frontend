'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CourseCard from './components/CourseCard';
import { localCart } from './lib/api';
import { fallbackCourses, fallbackCategories } from './lib/fallbackData';
import styles from './page.module.css';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Try backend first
      const [coursesRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:5000/api/courses/featured').then((r) => r.json()),
        fetch('http://localhost:5000/api/categories').then((r) => r.json()),
      ]);
      setCourses(coursesRes.data || fallbackCourses.filter((c) => c.is_featured));
      setCategories(categoriesRes.data || fallbackCategories);
    } catch {
      // Fallback to local data
      setCourses(fallbackCourses.filter((c) => c.is_featured));
      setCategories(fallbackCategories);
    }
    setLoading(false);
  }

  function handleAddToCart(course) {
    localCart.add(course);
    // Toast notification
    showToast(`"${course.title}" added to cart!`);
  }

  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `<span>✅</span><span class="toast-message">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  return (
    <>
      <Navbar />

      {/* ========== HERO SECTION ========== */}
      <section className={styles.hero} id="hero">
        <div className={styles['hero-bg']} />
        <div className={styles['hero-content']}>
          {/* Text */}
          <div className={styles['hero-text']}>
            <div className={styles['hero-badge']}>
              🚀 Trusted by 200K+ Learners Worldwide
            </div>
            <h1 className={styles['hero-title']}>
              Master Skills.<br />
              Build <span className={styles.highlight}>Your Future</span>.<br />
              Learn Without Limits.
            </h1>
            <p className={styles['hero-subtitle']}>
              Unlock premium courses from top industry experts. From web development 
              to AI, accelerate your career with hands-on, project-based learning.
            </p>
            <div className={styles['hero-actions']}>
              <Link href="/courses" className="btn btn-primary btn-lg">
                Explore Courses →
              </Link>
              <Link href="/categories" className="btn btn-outline btn-lg">
                Browse Categories
              </Link>
            </div>
            <div className={styles['hero-stats']}>
              <div className={styles['hero-stat']}>
                <div className={styles['hero-stat-value']}>200K+</div>
                <div className={styles['hero-stat-label']}>Students</div>
              </div>
              <div className={styles['hero-stat']}>
                <div className={styles['hero-stat-value']}>50+</div>
                <div className={styles['hero-stat-label']}>Courses</div>
              </div>
              <div className={styles['hero-stat']}>
                <div className={styles['hero-stat-value']}>4.8</div>
                <div className={styles['hero-stat-label']}>Avg Rating</div>
              </div>
              <div className={styles['hero-stat']}>
                <div className={styles['hero-stat-value']}>15+</div>
                <div className={styles['hero-stat-label']}>Experts</div>
              </div>
            </div>
          </div>

          {/* Visual Cards */}
          <div className={styles['hero-visual']}>
            <div className={styles['hero-cards']}>
              <div className={styles['hero-mini-card']}>
                <span className={styles.icon}>🌐</span>
                <h4>Web Development</h4>
                <p>React, Next.js, Node.js</p>
                <div className={styles['mini-stat']}>↑ 54K students</div>
              </div>
              <div className={styles['hero-mini-card']}>
                <span className={styles.icon}>📊</span>
                <h4>Data Science</h4>
                <p>Python, ML, TensorFlow</p>
                <div className={styles['mini-stat']}>↑ 41K students</div>
              </div>
              <div className={styles['hero-mini-card']}>
                <span className={styles.icon}>☁️</span>
                <h4>Cloud & DevOps</h4>
                <p>AWS, Docker, K8s</p>
                <div className={styles['mini-stat']}>↑ 29K students</div>
              </div>
              <div className={styles['hero-mini-card']}>
                <span className={styles.icon}>🔒</span>
                <h4>Cybersecurity</h4>
                <p>Ethical Hacking, Pentesting</p>
                <div className={styles['mini-stat']}>↑ 25K students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <div className={styles['stats-bar']}>
        <div className={styles['stats-grid']}>
          <div className={styles['stat-item']}>
            <span className={styles['stat-icon']}>📚</span>
            <div className={styles['stat-value']}>12+</div>
            <div className={styles['stat-label']}>Premium Courses</div>
          </div>
          <div className={styles['stat-item']}>
            <span className={styles['stat-icon']}>👨‍🏫</span>
            <div className={styles['stat-value']}>6</div>
            <div className={styles['stat-label']}>Expert Instructors</div>
          </div>
          <div className={styles['stat-item']}>
            <span className={styles['stat-icon']}>⏰</span>
            <div className={styles['stat-value']}>500+</div>
            <div className={styles['stat-label']}>Hours of Content</div>
          </div>
          <div className={styles['stat-item']}>
            <span className={styles['stat-icon']}>🎖️</span>
            <div className={styles['stat-value']}>100%</div>
            <div className={styles['stat-label']}>Completion Certificates</div>
          </div>
        </div>
      </div>

      {/* ========== CATEGORIES SECTION ========== */}
      <section className="section" id="categories">
        <div className="container">
          <div className="section-header">
            <h2>Browse Categories</h2>
            <p>Explore our curated course categories spanning the most in-demand tech skills</p>
          </div>
          <div className={styles['categories-grid']}>
            {categories.map((cat) => (
              <Link
                href={`/courses?category=${cat.slug}`}
                key={cat.id || cat.slug}
                className={styles['category-card']}
              >
                <span className={styles['category-icon']}>{cat.icon}</span>
                <div className={styles['category-name']}>{cat.name}</div>
                <div className={styles['category-count']}>
                  {cat.course_count || 0} courses
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED COURSES ========== */}
      <section className="section" id="featured-courses">
        <div className="container">
          <div className="section-header">
            <h2>⭐ Featured Courses</h2>
            <p>Handpicked courses with the highest ratings and demand from our community</p>
          </div>

          {loading ? (
            <div className={styles['courses-grid']}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="card" style={{ height: '420px' }}>
                  <div className="skeleton" style={{ height: '180px' }} />
                  <div style={{ padding: '20px' }}>
                    <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '12px' }} />
                    <div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '16px' }} />
                    <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles['courses-grid']}>
              {courses.slice(0, 6).map((course) => (
                <CourseCard
                  key={course.id || course.slug}
                  course={course}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          <div className={styles['courses-view-all']}>
            <Link href="/courses" className="btn btn-outline btn-lg">
              View All Courses →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className={styles['cta-section']}>
        <div className="container">
          <div className={styles['cta-inner']}>
            <h2>🎓 Start Your Learning Journey Today</h2>
            <p>
              Join 200,000+ learners who have transformed their careers with SSP Books. 
              Get lifetime access to premium courses at unbeatable prices.
            </p>
            <div className={styles['cta-actions']}>
              <Link href="/courses" className="btn btn-primary btn-lg">
                Browse All Courses
              </Link>
              <Link href="/register" className="btn btn-outline btn-lg">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
