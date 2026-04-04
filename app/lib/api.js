// =============================================
// SSP Books Frontend - API Utility
// =============================================

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://20.24.192.145:5000/api').replace(/\/$/, '');

/**
 * Fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ssp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// =============================================
// API Methods
// =============================================

export const api = {
  // Health
  health: () => fetchAPI('/health'),

  // Auth
  login: (email, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getProfile: () => fetchAPI('/auth/me'),

  // Courses
  getCourses: (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    return fetchAPI(`/courses?${searchParams}`);
  },

  getFeaturedCourses: () => fetchAPI('/courses/featured'),

  getBestsellerCourses: () => fetchAPI('/courses/bestsellers'),

  getCourse: (slug) => fetchAPI(`/courses/${slug}`),

  // Categories
  getCategories: () => fetchAPI('/categories'),

  getCategory: (slug) => fetchAPI(`/categories/${slug}`),

  // Cart
  getCart: () => fetchAPI('/cart'),

  addToCart: (courseId) =>
    fetchAPI('/cart', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    }),

  removeFromCart: (courseId) =>
    fetchAPI(`/cart/${courseId}`, { method: 'DELETE' }),

  clearCart: () =>
    fetchAPI('/cart', { method: 'DELETE' }),

  // Orders
  checkout: () =>
    fetchAPI('/orders/checkout', { method: 'POST' }),

  getOrders: () => fetchAPI('/orders'),

  getOrder: (id) => fetchAPI(`/orders/${id}`),
};

// =============================================
// Local Cart (for non-auth users)
// =============================================

export const localCart = {
  get: () => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('ssp_cart') || '[]');
  },

  add: (course) => {
    const cart = localCart.get();
    if (!cart.find((item) => item.id === course.id)) {
      cart.push(course);
      localStorage.setItem('ssp_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
    return cart;
  },

  remove: (courseId) => {
    let cart = localCart.get();
    cart = cart.filter((item) => item.id !== courseId);
    localStorage.setItem('ssp_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    return cart;
  },

  clear: () => {
    localStorage.setItem('ssp_cart', '[]');
    window.dispatchEvent(new Event('cartUpdated'));
    return [];
  },

  count: () => localCart.get().length,
};

export default api;
