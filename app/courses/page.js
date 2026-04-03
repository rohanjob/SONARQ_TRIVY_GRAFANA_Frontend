'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { localCart } from '../lib/api';
import { fallbackCourses, fallbackCategories } from '../lib/fallbackData';
import styles from './page.module.css';

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryFilter);
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    setActiveCategory(categoryFilter);
  }, [categoryFilter]);

  async function loadCourses() {
    try {
      const [coursesRes, catsRes] = await Promise.all([
        fetch('http://localhost:5000/api/courses?limit=50').then((r) => r.json()),
        fetch('http://localhost:5000/api/categories').then((r) => r.json()),
      ]);
      setCourses(coursesRes.data || fallbackCourses);
      setCategories(catsRes.data || fallbackCategories);
    } catch {
      setCourses(fallbackCourses);
      setCategories(fallbackCategories);
    }
    setLoading(false);
  }

  function handleAddToCart(course) {
    localCart.add(course);
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `<span>✅</span><span class="toast-message">"${course.title}" added to cart!</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    if (activeCategory !== 'all' && course.category_slug !== activeCategory) return false;
    if (activeDifficulty !== 'all' && course.difficulty !== activeDifficulty) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(q) ||
        course.author.toLowerCase().includes(q) ||
        (course.description || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <main className={styles['courses-page']}>
        <div className="container">
          <div className={styles['page-header']}>
            <h1>📚 All Courses</h1>
            <p>Discover expert-led courses to boost your skills and career</p>
          </div>

          {/* Filters */}
          <div className={styles['filters-bar']}>
            <button
              className={`${styles['filter-chip']} ${activeCategory === 'all' ? styles.active : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                className={`${styles['filter-chip']} ${activeCategory === cat.slug ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat.slug)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Difficulty Filters */}
          <div className={styles['filters-bar']}>
            {difficulties.map((d) => (
              <button
                key={d}
                className={`${styles['filter-chip']} ${activeDifficulty === d ? styles.active : ''}`}
                onClick={() => setActiveDifficulty(d)}
                style={{ textTransform: 'capitalize' }}
              >
                {d === 'all' ? '📋 All Levels' : d}
              </button>
            ))}
            <div className={styles['filter-search']}>
              <input
                type="text"
                className="input"
                placeholder="🔍 Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="course-search"
              />
            </div>
          </div>

          <div className={styles['courses-count']}>
            Showing {filteredCourses.length} of {courses.length} courses
          </div>

          {/* Course Grid */}
          {loading ? (
            <div className={styles['courses-grid']}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card" style={{ height: '420px' }}>
                  <div className="skeleton" style={{ height: '180px' }} />
                  <div style={{ padding: '20px' }}>
                    <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '12px' }} />
                    <div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ height: '14px', width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className={styles['courses-grid']}>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id || course.slug}
                  course={course}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className={styles['no-results']}>
              <h3>No courses found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
