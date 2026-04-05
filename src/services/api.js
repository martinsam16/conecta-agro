import products from '../data/products.json';
import chatHistory from '../data/chatHistory.json';
import producers from '../data/producers.json';
import categories from '../data/categories.json';

// Simulated API calls with delay to mimic real network requests
export const getCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 300);
  });
};

// Simulated API calls with delay to mimic real network requests
export const getProductDetails = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (id) {
        const found = products.find(p => p.id === id);
        if (found) return resolve(found);
      }
      resolve(products[0]); // fallback
    }, 300);
  });
};

export const getRecommendations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.slice(0, 12)); // Returns more products for the carousel
    }, 500);
  });
};

export const getChatHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(chatHistory);
    }, 300);
  });
};

export const getCategoryProducts = async (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return filtered ones if category present and not 'Todas las categorias', else all.
      if (category && category.toLowerCase() !== 'todas las categorías' && category !== 'Todas') {
        const filtered = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
        resolve(filtered.length > 0 ? filtered : products);
      } else {
        resolve(products);
      }
    }, 500);
  });
};

export const searchProducts = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const filtered = products.filter(p =>
        (p.title && p.title.toLowerCase().includes(lowerQuery)) ||
        (p.producer && p.producer.toLowerCase().includes(lowerQuery)) ||
        (p.category && p.category.toLowerCase().includes(lowerQuery))
      );
      resolve(filtered);
    }, 500);
  });
};

export const getProducers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(producers);
    }, 500);
  });
};
