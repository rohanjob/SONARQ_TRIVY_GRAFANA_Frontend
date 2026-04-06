'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { API_BASE, localCart } from '../../lib/api';
import { fallbackCourses } from '../../lib/fallbackData';
import styles from './page.module.css';

const categoryIcons = {
  'web-development': 'WD',
  'data-science': 'DS',
  'mobile-development': 'MD',
  'cloud-devops': 'CD',
  cybersecurity: 'CS',
  'ui-ux-design': 'UX',
  'programming-languages': 'PL',
  'database-management': 'DB',
};

export default function CourseDetailClient({ slug }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadCourse() {
      try {
        const res = await fetch(`${API_BASE}/courses/${slug}`);
        const data = await res.json();

        if (!isActive) {
          return;
        }

        setCourse(data.data || fallbackCourses.find((item) => item.slug === slug) || null);
      } catch {
        if (!isActive) {
          return;
        }

        setCourse(fallbackCourses.find((item) => item.slug === slug) || null);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      isActive = false;
    };
  }, [slug]);

  function handleAddToCart() {
    if (!course) {
      return;
    }

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

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles['detail-page']}>
          <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
            <div className="skeleton" style={{ height: '40px', width: '60%', margin: '0 auto 20px' }} />
            <div className="skeleton" style={{ height: '20px', width: '40%', margin: '0 auto' }} />
          </div>
        </main>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <main className={styles['detail-page']}>
          <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
            <h2>Course not found</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
              The course you&apos;re looking for does not exist.
            </p>
            <Link href="/courses" className="btn btn-primary" style={{ marginTop: '24px' }}>
              Browse Courses
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const icon = categoryIcons[course.category_slug] || 'CR';
  const displayPrice = course.discount_price || course.price;
  const discountPct = course.discount_price
    ? Math.round(((course.price - course.discount_price) / course.price) * 100)
    : 0;

  return (
    <>
      <Navbar />
      <main className={styles['detail-page']}>
        <div className={styles['detail-header']}>
          <div className="container">
            <div className={styles['detail-header-inner']}>
              <div>
                <div className={styles['detail-breadcrumb']}>
                  <Link href="/">Home</Link> <span>/</span>
                  <Link href="/courses">Courses</Link> <span>/</span>
                  <span>{course.category_name}</span>
                </div>

                <div className={styles['detail-badges']}>
                  {course.is_featured && <span className="badge badge-primary">Featured</span>}
                  {course.is_bestseller && <span className="badge badge-warning">Bestseller</span>}
                  <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                    {course.difficulty}
                  </span>
                </div>

                <h1 className={styles['detail-title']}>{course.title}</h1>
                <p className={styles['detail-desc']}>
                  {course.short_description || course.description}
                </p>

                <div className={styles['detail-meta']}>
                  <span className={`${styles['detail-meta-item']} ${styles['detail-rating']}`}>
                    Rating {Number(course.rating).toFixed(1)} ({Number(course.reviews_count).toLocaleString()} reviews)
                  </span>
                  <span className={styles['detail-meta-item']}>
                    {Number(course.students_count).toLocaleString()} students
                  </span>
                  <span className={styles['detail-meta-item']}>
                    {course.duration_hours} hours
                  </span>
                  <span className={styles['detail-meta-item']}>
                    {course.lessons_count} lessons
                  </span>
                </div>

                <div className={styles['detail-author-info']}>
                  <div className={styles['detail-author-avatar']}>
                    {(course.author || 'U')[0]}
                  </div>
                  <div>
                    <div className={styles['detail-author-name']}>{course.author}</div>
                    <div className={styles['detail-author-label']}>Instructor</div>
                  </div>
                </div>
              </div>

              <div className={styles['purchase-card']}>
                <div
                  className={styles['purchase-thumb']}
                  style={{
                    background: `linear-gradient(135deg, hsl(${(course.slug || '').length * 30}, 60%, 20%) 0%, hsl(${(course.slug || '').length * 30 + 40}, 70%, 15%) 100%)`,
                  }}
                >
                  {icon}
                </div>

                <div className={styles['purchase-price']}>
                  <span className={styles['purchase-price-current']}>INR {Number(displayPrice).toLocaleString()}</span>
                  {course.discount_price && (
                    <span className={styles['purchase-price-original']}>INR {Number(course.price).toLocaleString()}</span>
                  )}
                </div>

                {discountPct > 0 && (
                  <div className={styles['purchase-discount']}>{discountPct}% off for a limited time</div>
                )}

                <div className={styles['purchase-actions']}>
                  <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ width: '100%' }}>
                    Add to Cart
                  </button>
                  <button className="btn btn-outline" style={{ width: '100%' }}>
                    Buy Now
                  </button>
                </div>

                <ul className={styles['purchase-features']}>
                  <li><span>OK</span> {course.duration_hours} hours on-demand video</li>
                  <li><span>OK</span> {course.lessons_count} downloadable resources</li>
                  <li><span>OK</span> Full lifetime access</li>
                  <li><span>OK</span> Certificate of completion</li>
                  <li><span>OK</span> Access on mobile and desktop</li>
                  <li><span>OK</span> 30-day money-back guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles['detail-section']}>
            <h2>About This Course</h2>
            <div className={styles['detail-full-desc']}>
              {course.description}
            </div>
          </div>

          {course.tags && course.tags.length > 0 && (
            <div className={styles['detail-section']}>
              <h2>Topics Covered</h2>
              <div className={styles['tags-list']}>
                {course.tags.map((tag) => (
                  <span key={tag} className={styles['tag-chip']}>#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {course.reviews && course.reviews.length > 0 && (
            <div className={styles['detail-section']}>
              <h2>Student Reviews</h2>
              {course.reviews.map((review) => (
                <div key={review.id} className={styles['review-item']}>
                  <div className={styles['review-header']}>
                    <div className={styles['review-avatar']}>
                      {(review.user_name || 'U')[0]}
                    </div>
                    <span className={styles['review-name']}>{review.user_name}</span>
                    <span className={styles['review-rating']}>
                      {'*'.repeat(review.rating)}
                    </span>
                  </div>
                  <div className={styles['review-comment']}>{review.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
