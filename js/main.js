/**
 * Main JavaScript file for the jewelry e-commerce store
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize mobile menu functionality
  initMobileMenu();
  
  // Initialize wishlist icons
  initWishlistIcons();
  
  // Handle scroll events
  handleScrollEvents();
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    overlay.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

/**
 * Initialize wishlist icons
 */
function initWishlistIcons() {
  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem('eleganceWishlist')) || [];
  
  // Update wishlist icons
  const wishlistButtons = document.querySelectorAll('.product-wishlist');
  
  wishlistButtons.forEach(button => {
    const productCard = button.closest('.product-card');
    if (!productCard) return;
    
    // Get product ID from data attribute or parent element
    const productId = parseInt(productCard.dataset.productId);
    
    if (wishlist.includes(productId)) {
      button.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
      button.innerHTML = '<i class="far fa-heart"></i>';
    }
  });
}

/**
 * Handle scroll events
 */
function handleScrollEvents() {
  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/**
 * Format price with currency symbol
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

/**
 * Get URL parameter by name
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value or null if not found
 */
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * Create image slider
 * @param {HTMLElement} container - Container element
 * @param {Array} images - Array of image URLs
 */
function createImageSlider(container, images) {
  if (!container || !images || images.length === 0) return;
  
  // Clear container
  container.innerHTML = '';
  
  // Create slider elements
  const sliderWrapper = document.createElement('div');
  sliderWrapper.className = 'slider-wrapper';
  
  const slider = document.createElement('div');
  slider.className = 'slider';
  
  // Add images to slider
  images.forEach((imageUrl, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.style.display = index === 0 ? 'block' : 'none';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `Product image ${index + 1}`;
    
    slide.appendChild(img);
    slider.appendChild(slide);
  });
  
  sliderWrapper.appendChild(slider);
  
  // Create navigation dots
  if (images.length > 1) {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    
    images.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.dataset.index = index;
      
      dot.addEventListener('click', () => {
        showSlide(index);
      });
      
      dotsContainer.appendChild(dot);
    });
    
    sliderWrapper.appendChild(dotsContainer);
    
    // Create navigation arrows
    const prevArrow = document.createElement('div');
    prevArrow.className = 'slider-arrow prev';
    prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    prevArrow.addEventListener('click', () => {
      const currentIndex = getCurrentSlideIndex();
      const newIndex = (currentIndex - 1 + images.length) % images.length;
      showSlide(newIndex);
    });
    
    const nextArrow = document.createElement('div');
    nextArrow.className = 'slider-arrow next';
    nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    nextArrow.addEventListener('click', () => {
      const currentIndex = getCurrentSlideIndex();
      const newIndex = (currentIndex + 1) % images.length;
      showSlide(newIndex);
    });
    
    sliderWrapper.appendChild(prevArrow);
    sliderWrapper.appendChild(nextArrow);
  }
  
  container.appendChild(sliderWrapper);
  
  // Add swipe functionality
  let startX, endX;
  const minSwipeDistance = 50;
  
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  slider.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    
    const distance = startX - endX;
    
    if (Math.abs(distance) >= minSwipeDistance) {
      const currentIndex = getCurrentSlideIndex();
      
      if (distance > 0) {
        // Swipe left, show next slide
        const newIndex = (currentIndex + 1) % images.length;
        showSlide(newIndex);
      } else {
        // Swipe right, show previous slide
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        showSlide(newIndex);
      }
    }
  });
  
  /**
   * Get current slide index
   * @returns {number} Current slide index
   */
  function getCurrentSlideIndex() {
    const activeSlide = slider.querySelector('.slide[style*="display: block"]');
    return Array.from(slider.children).indexOf(activeSlide);
  }
  
  /**
   * Show slide by index
   * @param {number} index - Slide index to show
   */
  function showSlide(index) {
    // Hide all slides
    const slides = slider.querySelectorAll('.slide');
    slides.forEach(slide => {
      slide.style.display = 'none';
    });
    
    // Show selected slide
    slides[index].style.display = 'block';
    
    // Update dots
    const dots = dotsContainer?.querySelectorAll('.dot');
    if (dots) {
      dots.forEach(dot => {
        dot.classList.remove('active');
      });
      dots[index].classList.add('active');
    }
  }
}