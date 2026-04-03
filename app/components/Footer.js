import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-grid']}>
        {/* Brand */}
        <div className={styles['footer-brand']}>
          <h3>📚 <span>SSP</span> Books</h3>
          <p>
            Empowering learners worldwide with premium, expert-led courses.
            Master in-demand skills and accelerate your career with SSP Books.
          </p>
          <div className={styles['footer-social']}>
            <a href="#" aria-label="GitHub">🐙</a>
            <a href="#" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="YouTube">▶️</a>
          </div>
        </div>

        {/* Explore */}
        <div className={styles['footer-column']}>
          <h4>Explore</h4>
          <ul>
            <li><Link href="/courses">All Courses</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/">Featured</Link></li>
            <li><Link href="/">Bestsellers</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className={styles['footer-column']}>
          <h4>Categories</h4>
          <ul>
            <li><Link href="/courses?category=web-development">Web Development</Link></li>
            <li><Link href="/courses?category=data-science">Data Science</Link></li>
            <li><Link href="/courses?category=cloud-devops">Cloud & DevOps</Link></li>
            <li><Link href="/courses?category=mobile-development">Mobile Dev</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className={styles['footer-column']}>
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles['footer-bottom']}>
        <p>© 2026 SSP Books. All rights reserved. Built with ❤️ by SSP Tech Edu</p>
        <div className={styles['footer-bottom-links']}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
