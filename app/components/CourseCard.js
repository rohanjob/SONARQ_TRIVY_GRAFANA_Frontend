'use client';

import Link from 'next/link';
import styles from './CourseCard.module.css';

// Category icon mapping
const categoryIcons = {
  'web-development': '🌐',
  'data-science': '📊',
  'mobile-development': '📱',
  'cloud-devops': '☁️',
  'cybersecurity': '🔒',
  'ui-ux-design': '🎨',
  'programming-languages': '💻',
  'database-management': '🗄️',
};

// Difficulty dots
function DifficultyDots({ level }) {
  const levels = { beginner: 1, intermediate: 2, advanced: 3 };
  const activeCount = levels[level] || 1;

  return (
    <div className={styles['card-difficulty']}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`${styles['diff-dot']} ${i <= activeCount ? styles.active : ''} ${i <= activeCount ? styles[level] : ''}`}
        />
      ))}
      <span style={{ fontSize: '0.75rem', marginLeft: '4px', textTransform: 'capitalize' }}>
        {level}
      </span>
    </div>
  );
}

export default function CourseCard({ course, onAddToCart }) {
  const discountPercentage = course.discount_price
    ? Math.round(((course.price - course.discount_price) / course.price) * 100)
    : 0;

  const displayPrice = course.discount_price || course.price;
  const icon = categoryIcons[course.category_slug] || '📘';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(course);
  };

  return (
    <Link href={`/courses/${course.slug}`} className={styles['course-card']}>
      {/* Thumbnail */}
      <div className={styles['card-thumb']}>
        <div
          className={styles['card-thumb-gradient']}
          style={{
            background: `linear-gradient(135deg, 
              hsl(${(course.slug || '').length * 30}, 60%, 20%) 0%, 
              hsl(${(course.slug || '').length * 30 + 40}, 70%, 15%) 100%)`,
          }}
        >
          {icon}
        </div>
        <div className={styles['card-thumb-overlay']} />

        {/* Badges */}
        <div className={styles['card-badges']}>
          {course.is_featured && <span className={styles['card-badge-featured']}>⭐ FEATURED</span>}
          {course.is_bestseller && <span className={styles['card-badge-bestseller']}>🔥 BESTSELLER</span>}
        </div>
      </div>

      {/* Body */}
      <div className={styles['card-body']}>
        <div className={styles['card-category']}>{course.category_name || 'Course'}</div>
        <h3 className={styles['card-title']}>{course.title}</h3>
        <p className={styles['card-desc']}>{course.short_description || course.description}</p>

        {/* Meta */}
        <div className={styles['card-meta']}>
          <span className={`${styles['card-meta-item']} ${styles['card-rating']}`}>
            <span className={styles.icon}>⭐</span> {Number(course.rating).toFixed(1)}
          </span>
          <span className={styles['card-meta-item']}>
            <span className={styles.icon}>👥</span> {Number(course.students_count).toLocaleString()}
          </span>
          <span className={styles['card-meta-item']}>
            <span className={styles.icon}>⏱️</span> {course.duration_hours}h
          </span>
          <DifficultyDots level={course.difficulty} />
        </div>

        {/* Author */}
        <div className={styles['card-author']}>
          <div className={styles['card-author-avatar']}>
            {(course.author || 'U')[0]}
          </div>
          <span className={styles['card-author-name']}>{course.author}</span>
        </div>

        {/* Footer - Price & Action */}
        <div className={styles['card-footer']}>
          <div className={styles['card-price']}>
            <span className={styles['price-current']}>₹{Number(displayPrice).toLocaleString()}</span>
            {course.discount_price && (
              <>
                <span className={styles['price-original']}>₹{Number(course.price).toLocaleString()}</span>
                <span className={styles['price-discount']}>{discountPercentage}% OFF</span>
              </>
            )}
          </div>
          <button className={styles['card-action']} onClick={handleAddToCart} title="Add to Cart">
            🛒
          </button>
        </div>
      </div>
    </Link>
  );
}
