'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { localCart } from '../lib/api';
import styles from './page.module.css';

const categoryIcons = {
  'web-development': '🌐', 'data-science': '📊', 'mobile-development': '📱',
  'cloud-devops': '☁️', 'cybersecurity': '🔒', 'ui-ux-design': '🎨',
  'programming-languages': '💻', 'database-management': '🗄️',
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(localCart.get());
  }, []);

  function removeItem(courseId) {
    const updated = localCart.remove(courseId);
    setCartItems(updated);
  }

  function clearAll() {
    localCart.clear();
    setCartItems([]);
  }

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
  const discount = cartItems.reduce((sum, item) => {
    if (item.discount_price) {
      return sum + (parseFloat(item.price) - parseFloat(item.discount_price));
    }
    return sum;
  }, 0);
  const total = subtotal - discount;

  return (
    <>
      <Navbar />
      <main className={styles['cart-page']}>
        <div className="container">
          <div className={styles['page-header']}>
            <h1>🛒 Your Cart</h1>
            <p>{cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} in cart</p>
          </div>

          <div className={styles['cart-layout']}>
            {cartItems.length === 0 ? (
              <div className={styles['cart-empty']}>
                <span className={styles['cart-empty-icon']}>🛒</span>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven&apos;t added any courses yet. Browse our catalog to find something amazing!</p>
                <Link href="/courses" className="btn btn-primary btn-lg">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className={styles['cart-items']}>
                  {cartItems.map((item) => {
                    const icon = categoryIcons[item.category_slug] || '📘';
                    const displayPrice = item.discount_price || item.price;
                    return (
                      <div key={item.id} className={styles['cart-item']}>
                        <div
                          className={styles['cart-item-thumb']}
                          style={{
                            background: `linear-gradient(135deg, hsl(${(item.slug || '').length * 30}, 60%, 20%) 0%, hsl(${(item.slug || '').length * 30 + 40}, 70%, 15%) 100%)`,
                          }}
                        >
                          {icon}
                        </div>
                        <div className={styles['cart-item-info']}>
                          <div className={styles['cart-item-category']}>{item.category_name || 'Course'}</div>
                          <h3 className={styles['cart-item-title']}>{item.title}</h3>
                          <div className={styles['cart-item-author']}>by {item.author}</div>
                          <div className={styles['cart-item-meta']}>
                            <span>⭐ {Number(item.rating).toFixed(1)}</span>
                            <span>⏱️ {item.duration_hours}h</span>
                            <span>📖 {item.lessons_count} lessons</span>
                          </div>
                        </div>
                        <div className={styles['cart-item-actions']}>
                          <div className={styles['cart-item-price']}>
                            <div className={styles['cart-item-price-current']}>₹{Number(displayPrice).toLocaleString()}</div>
                            {item.discount_price && (
                              <div className={styles['cart-item-price-original']}>₹{Number(item.price).toLocaleString()}</div>
                            )}
                          </div>
                          <button
                            className={styles['cart-item-remove']}
                            onClick={() => removeItem(item.id)}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <button className="btn btn-ghost" onClick={clearAll} style={{ alignSelf: 'flex-start' }}>
                    🗑️ Clear Cart
                  </button>
                </div>

                {/* Summary */}
                <div className={styles['cart-summary']}>
                  <h3>Order Summary</h3>

                  <div className={styles['summary-row']}>
                    <span className={styles['summary-label']}>Subtotal ({cartItems.length} items)</span>
                    <span className={styles['summary-value']}>₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className={styles['summary-row']}>
                      <span className={styles['summary-label']}>Discount</span>
                      <span className={`${styles['summary-value']} ${styles['summary-discount']}`}>
                        -₹{discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className={styles['summary-total']}>
                    <span className={styles['summary-total-label']}>Total</span>
                    <span className={styles['summary-total-value']}>₹{total.toLocaleString()}</span>
                  </div>

                  <button className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '10px' }}>
                    Proceed to Checkout
                  </button>
                  <Link href="/courses" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                    Continue Shopping
                  </Link>

                  <div className={styles['summary-guarantee']}>
                    🔒 Secure checkout · 30-day money-back guarantee
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
