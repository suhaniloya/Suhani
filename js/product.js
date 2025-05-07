/**
 * Product page functionality for the jewelry e-commerce store
 */

document.addEventListener('DOMContentLoaded', () => {
  // Get product ID from URL
  const productId = parseInt(getUrlParameter('id'));
  
  if (isNaN(productId)) {
    // If product ID is not valid, redirect to collections page
    window.location.href = 'collections.html';
    return;
  }
  
  // Find product in data
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    // If product not found, redirect to collections page
    window.location.href = 'collections.html';
    return;
  }
  
  // Load product details
  loadProductDetails(product);
  
  // Load similar products
  loadSimilarProducts(product);
});

/**
 * Load product details
 * @param {Object} product - Product data
 */
function loadProductDetails(product) {
  // Set page title
  document.title = `${product.name} - Elegance`;
  
  // Product gallery
  const galleryContainer = document.getElementById('product-gallery');
  if (galleryContainer) {
    createImageSlider(galleryContainer, product.images);
  }
  
  // Product name
  const productNameElement = document.getElementById('product-name');
  if (productNameElement) {
    productNameElement.textContent = product.name;
  }
  
  // Product price
  const productPriceElement = document.getElementById('product-price');
  if (productPriceElement) {
    let priceHTML = `<span class="current-price">$${product.price.toFixed(2)}</span>`;
    
    if (product.originalPrice) {
      priceHTML += `
        <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
        <span class="discount">${product.discount}</span>
      `;
    }
    
    productPriceElement.innerHTML = priceHTML;
  }
  
  // Product rating
  const productRatingElement = document.getElementById('product-rating');
  if (productRatingElement && product.rating) {
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    let starsHTML = '<div class="stars">';
    
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
      starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="far fa-star"></i>';
    }
    
    starsHTML += '</div>';
    
    if (product.ratingCount) {
      starsHTML += `<span class="rating-count">${product.rating} (${product.ratingCount} reviews)</span>`;
    }
    
    productRatingElement.innerHTML = starsHTML;
  }
  
  // Product description
  const productShortDescriptionElement = document.getElementById('product-short-description');
  const productFullDescriptionElement = document.getElementById('product-full-description');
  
  if (productShortDescriptionElement && productFullDescriptionElement) {
    // Short description (first sentence)
    const firstSentence = product.description.split('.')[0] + '.';
    productShortDescriptionElement.innerHTML = `
      <p>${firstSentence}</p>
      <span class="view-description">View Full Description</span>
    `;
    
    // Full description
    productFullDescriptionElement.innerHTML = `<p>${product.description}</p>`;
    
    // Toggle description
    const viewDescriptionButton = productShortDescriptionElement.querySelector('.view-description');
    
    viewDescriptionButton.addEventListener('click', () => {
      if (productFullDescriptionElement.classList.contains('expanded')) {
        productFullDescriptionElement.classList.remove('expanded');
        viewDescriptionButton.textContent = 'View Full Description';
      } else {
        productFullDescriptionElement.classList.add('expanded');
        viewDescriptionButton.textContent = 'Hide Description';
      }
    });
  }
  
  // Quantity selector
  const quantityInput = document.getElementById('quantity');
  const decreaseBtn = document.querySelector('.quantity-btn.decrease');
  const increaseBtn = document.querySelector('.quantity-btn.increase');
  
  if (quantityInput && decreaseBtn && increaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
    
    increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      quantityInput.value = currentValue + 1;
    });
    
    quantityInput.addEventListener('change', () => {
      const value = parseInt(quantityInput.value);
      if (isNaN(value) || value < 1) {
        quantityInput.value = 1;
      }
    });
  }
  
  // Add to cart button
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(quantityInput.value);
      addToCart(product, quantity);
    });
  }
  
  // Buy now button
  const buyNowBtn = document.getElementById('buy-now-btn');
  
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const quantity = parseInt(quantityInput.value);
      addToCart(product, quantity);
      window.location.href = 'checkout.html';
    });
  }
  
  // Wishlist button
  const wishlistBtn = document.getElementById('add-to-wishlist-btn');
  
  if (wishlistBtn) {
    // Get wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('eleganceWishlist')) || [];
    
    // Check if product is already in wishlist
    if (wishlist.includes(product.id)) {
      wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
      wishlistBtn.classList.add('active');
    }
    
    wishlistBtn.addEventListener('click', () => {
      // Toggle wishlist
      if (wishlist.includes(product.id)) {
        // Remove from wishlist
        const index = wishlist.indexOf(product.id);
        wishlist.splice(index, 1);
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        wishlistBtn.classList.remove('active');
        showNotification('Removed from wishlist!');
      } else {
        // Add to wishlist
        wishlist.push(product.id);
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        wishlistBtn.classList.add('active');
        showNotification('Added to wishlist!');
      }
      
      // Save wishlist to localStorage
      localStorage.setItem('eleganceWishlist', JSON.stringify(wishlist));
    });
  }
}

/**
 * Load similar products
 * @param {Object} product - Current product
 */
function loadSimilarProducts(product) {
  const similarProductsGrid = document.getElementById('similar-products-grid');
  
  if (!similarProductsGrid) return;
  
  // Filter similar products (same category but different ID)
  const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id);
  
  // If no similar products, hide the section
  if (similarProducts.length === 0) {
    const similarProductsSection = document.querySelector('.similar-products');
    if (similarProductsSection) {
      similarProductsSection.style.display = 'none';
    }
    return;
  }
  
  // Only show up to 4 similar products
  const productsToShow = similarProducts.slice(0, 4);
  
  // Render similar products
  productsToShow.forEach(product => {
    const productCard = createProductCard(product);
    similarProductsGrid.appendChild(productCard);
  });
  
  // Initialize wishlist icons
  initWishlistIcons();
}

/**
 * Create product card element
 * @param {Object} product - Product data
 * @returns {HTMLElement} Product card element
 */
function createProductCard(product) {
  const productCard = document.createElement('div');
  productCard.className = 'product-card';
  productCard.dataset.productId = product.id;
  
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
    e.stopPropagation();
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
  
  // Product actions
  const productActions = document.createElement('div');
  productActions.className = 'product-actions';
  
  const addToCartButton = document.createElement('button');
  addToCartButton.className = 'btn btn-primary';
  addToCartButton.textContent = 'Add to Cart';
  addToCartButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  });
  productActions.appendChild(addToCartButton);
  
  productInfo.appendChild(productActions);
  productCard.appendChild(productInfo);
  
  // Make the entire card clickable (except for buttons and wishlist)
  productCard.addEventListener('click', (e) => {
    // Ignore clicks on buttons and wishlist
    if (
      !e.target.closest('.product-actions') &&
      !e.target.closest('.product-wishlist')
    ) {
      window.location.href = `product.html?id=${product.id}`;
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