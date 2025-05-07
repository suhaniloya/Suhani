/**
 * Home page functionality for the jewelry e-commerce store
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load featured products
  loadFeaturedProducts();
  
  // Initialize testimonials slider
  initTestimonialsSlider();
  
  // Initialize newsletter form
  initNewsletterForm();
});

/**
 * Load featured products
 */
function loadFeaturedProducts() {
  const featuredProductsGrid = document.getElementById('featured-products-grid');
  
  if (!featuredProductsGrid) return;
  
  // Filter featured products
  const featuredProducts = products.filter(product => product.tags.includes('featured'));
  
  // Render featured products
  featuredProducts.forEach(product => {
    const productCard = createProductCard(product);
    featuredProductsGrid.appendChild(productCard);
  });
}

/**
 * Create product card element
 * @param {Object} product - Product data
 * @returns {HTMLElement} Product card element
 */
function createProductCard(product) {
  const productCard = document.createElement('div');
  productCard.className = 'product-card';
  
  // Create product image section
  const productImage = document.createElement('div');
  productImage.className = 'product-image';
  
  const img = document.createElement('img');
  img.src = product.images[0];
  img.alt = product.name;
  productImage.appendChild(img);
  
  // Create wishlist button
  const wishlistButton = document.createElement('div');
  wishlistButton.className = 'product-wishlist';
  wishlistButton.innerHTML = '<i class="far fa-heart"></i>';
  
  wishlistButton.addEventListener('click', (e) => {
    e.preventDefault();
    toggleWishlist(wishlistButton, product.id);
  });
  
  productImage.appendChild(wishlistButton);
  productCard.appendChild(productImage);
  
  // Create product info section
  const productInfo = document.createElement('div');
  productInfo.className = 'product-info';
  
  // Product name
  const productName = document.createElement('h3');
  productName.className = 'product-name';
  productName.textContent = product.name;
  productInfo.appendChild(productName);
  
  // Product price
  const productPrice = document.createElement('div');
  productPrice.className = 'product-price';
  
  const currentPrice = document.createElement('span');
  currentPrice.className = 'current-price';
  currentPrice.textContent = `$${product.price.toFixed(2)}`;
  productPrice.appendChild(currentPrice);
  
  if (product.originalPrice) {
    const originalPrice = document.createElement('span');
    originalPrice.className = 'original-price';
    originalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
    productPrice.appendChild(originalPrice);
    
    const discount = document.createElement('span');
    discount.className = 'discount';
    discount.textContent = product.discount;
    productPrice.appendChild(discount);
  }
  
  productInfo.appendChild(productPrice);
  
  // Product description
  const productDescription = document.createElement('p');
  productDescription.className = 'product-description';
  productDescription.textContent = product.description;
  productInfo.appendChild(productDescription);
  
  // View description button
  const viewDescription = document.createElement('span');
  viewDescription.className = 'view-description';
  viewDescription.textContent = 'View Description';
  
  viewDescription.addEventListener('click', () => {
    if (productDescription.style.webkitLineClamp === 'none') {
      productDescription.style.webkitLineClamp = '2';
      viewDescription.textContent = 'View Description';
    } else {
      productDescription.style.webkitLineClamp = 'none';
      viewDescription.textContent = 'Hide Description';
    }
  });
  
  productInfo.appendChild(viewDescription);
  
  // Product rating
  if (product.rating) {
    const productRating = document.createElement('div');
    productRating.className = 'product-rating';
    
    const stars = document.createElement('div');
    stars.className = 'stars';
    
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.innerHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
      stars.innerHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.innerHTML += '<i class="far fa-star"></i>';
    }
    
    productRating.appendChild(stars);
    
    if (product.ratingCount) {
      const ratingCount = document.createElement('span');
      ratingCount.className = 'rating-count';
      ratingCount.textContent = `(${product.ratingCount})`;
      productRating.appendChild(ratingCount);
    }
    
    productInfo.appendChild(productRating);
  }
  
  // Product actions
  const productActions = document.createElement('div');
  productActions.className = 'product-actions';
  
  const addToCartButton = document.createElement('button');
  addToCartButton.className = 'btn btn-primary';
  addToCartButton.textContent = 'Add to Cart';
  addToCartButton.addEventListener('click', () => {
    addToCart(product);
  });
  productActions.appendChild(addToCartButton);
  
  const buyNowButton = document.createElement('button');
  buyNowButton.className = 'btn btn-secondary';
  buyNowButton.textContent = 'Buy Now';
  buyNowButton.addEventListener('click', () => {
    addToCart(product);
    window.location.href = 'pages/checkout.html';
  });
  productActions.appendChild(buyNowButton);
  
  productInfo.appendChild(productActions);
  productCard.appendChild(productInfo);
  
  // Make the entire card clickable (except for buttons)
  productCard.addEventListener('click', (e) => {
    // Ignore clicks on buttons, wishlist, view description
    if (
      !e.target.closest('.product-actions') &&
      !e.target.closest('.product-wishlist') &&
      !e.target.closest('.view-description')
    ) {
      window.location.href = `pages/product.html?id=${product.id}`;
    }
  });
  
  return productCard;
}

/**
 * Toggle product in wishlist
 * @param {HTMLElement} wishlistButton - Wishlist button element
 * @param {number} productId - Product ID
 */
function toggleWishlist(wishlistButton, productId) {
  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem('eleganceWishlist')) || [];
  
  // Check if product is already in wishlist
  const index = wishlist.indexOf(productId);
  
  if (index > -1) {
    // Remove from wishlist
    wishlist.splice(index, 1);
    wishlistButton.innerHTML = '<i class="far fa-heart"></i>';
    showNotification('Removed from wishlist!');
  } else {
    // Add to wishlist
    wishlist.push(productId);
    wishlistButton.innerHTML = '<i class="fas fa-heart"></i>';
    showNotification('Added to wishlist!');
  }
  
  // Save wishlist to localStorage
  localStorage.setItem('eleganceWishlist', JSON.stringify(wishlist));
}

/**
 * Initialize testimonials slider
 */
function initTestimonialsSlider() {
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  if (testimonialSlides.length <= 1) return;
  
  let currentSlide = 0;
  const totalSlides = testimonialSlides.length;
  
  // Hide all slides except the first one
  for (let i = 1; i < totalSlides; i++) {
    testimonialSlides[i].style.display = 'none';
  }
  
  // Auto slide every 5 seconds
  setInterval(() => {
    testimonialSlides[currentSlide].style.display = 'none';
    currentSlide = (currentSlide + 1) % totalSlides;
    testimonialSlides[currentSlide].style.display = 'block';
  }, 5000);
}

/**
 * Initialize newsletter form
 */
function initNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (email) {
        // In a real application, you would send this to a server
        // For now, just show a notification
        showNotification('Thank you for subscribing to our newsletter!');
        emailInput.value = '';
      }
    });
  }
}