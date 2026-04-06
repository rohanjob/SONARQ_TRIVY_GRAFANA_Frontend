'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { API_BASE, localCart } from '../lib/api';
import { fallbackCategories, fallbackCourses } from '../lib/fallbackData';
import styles from './page.module.css';

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

export default function CoursesPageClient({ initialCategory }) {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadCourses() {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/courses?limit=50`).then((response) => response.json()),
          fetch(`${API_BASE}/categories`).then((response) => response.json()),
        ]);

        if (!isActive) {
          return;
        }

        setCourses(coursesRes.data || fallbackCourses);
        setCategories(categoriesRes.data || fallbackCategories);
      } catch {
        if (!isActive) {
          return;
        }

        setCourses(fallbackCourses);
        setCategories(fallbackCategories);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      isActive = false;
    };
  }, []);

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
    toast.innerHTML = `<span>Added</span><span class="toast-message">"${course.title}" added to cart.</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  const filteredCourses = courses.filter((course) => {
    if (activeCategory !== 'all' && course.category_slug !== activeCategory) {
      return false;
    }

    if (activeDifficulty !== 'all' && course.difficulty !== activeDifficulty) {
      return false;
    }

    if (!searchQuery) {
      return true;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.author.toLowerCase().includes(normalizedQuery) ||
      (course.description || '').toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <>
      <Navbar />
      <main className={styles['courses-page']}>
        <div className="container">
          <div className={styles['page-header']}>
            <h1>All Courses</h1>
            <p>Discover expert-led courses to boost your skills and career</p>
          </div>

          <div className={styles['filters-bar']}>
            <button
              className={`${styles['filter-chip']} ${activeCategory === 'all' ? styles.active : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                className={`${styles['filter-chip']} ${activeCategory === category.slug ? styles.active : ''}`}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          <div className={styles['filters-bar']}>
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                className={`${styles['filter-chip']} ${activeDifficulty === difficulty ? styles.active : ''}`}
                onClick={() => setActiveDifficulty(difficulty)}
                style={{ textTransform: 'capitalize' }}
              >
                {difficulty === 'all' ? 'All Levels' : difficulty}
              </button>
            ))}

            <div className={styles['filter-search']}>
              <input
                type="text"
                className="input"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                id="course-search"
              />
            </div>
          </div>

          <div className={styles['courses-count']}>
            Showing {filteredCourses.length} of {courses.length} courses
          </div>

          {loading ? (
            <div className={styles['courses-grid']}>
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="card" style={{ height: '420px' }}>
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
