/**
 * Cart functionality for the jewelry e-commerce store
 */

// Initialize cart from localStorage or empty array if no cart exists
let cart = JSON.parse(localStorage.getItem('eleganceCart')) || [];

/**
 * Update cart count in the header
 */
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  cartCountElements.forEach(element => {
    element.textContent = totalCount;
  });
}

/**
 * Add item to cart
 * @param {Object} product - Product to add to cart
 * @param {number} quantity - Quantity to add
 */
function addToCart(product, quantity = 1) {
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingItemIndex > -1) {
    // Product already in cart, update quantity
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Product not in cart, add new item
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity
    });
  }
  
  // Save cart to localStorage
  saveCart();
  
  // Update cart count
  updateCartCount();
  
  // Show notification
  showNotification(`${product.name} added to cart!`);
}

/**
 * Remove item from cart
 * @param {number} productId - ID of product to remove
 */
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  
  // Save cart to localStorage
  saveCart();
  
  // Update cart count
  updateCartCount();
  
  // Update cart page if on cart page
  if (window.location.pathname.includes('cart.html')) {
    renderCartItems();
    updateCartSummary();
  }
}

/**
 * Update quantity of item in cart
 * @param {number} productId - ID of product to update
 * @param {number} quantity - New quantity
 */
function updateCartItemQuantity(productId, quantity) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  
  if (itemIndex > -1) {
    if (quantity > 0) {
      cart[itemIndex].quantity = quantity;
    } else {
      // If quantity is 0 or negative, remove item from cart
      cart.splice(itemIndex, 1);
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart count
    updateCartCount();
    
    // Update cart page if on cart page
    if (window.location.pathname.includes('cart.html')) {
      renderCartItems();
      updateCartSummary();
    }
  }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
  localStorage.setItem('eleganceCart', JSON.stringify(cart));
}

/**
 * Clear cart
 */
function clearCart() {
  cart = [];
  saveCart();
  updateCartCount();
  
  // Update cart page if on cart page
  if (window.location.pathname.includes('cart.html')) {
    renderCartItems();
    updateCartSummary();
  }
}

/**
 * Calculate cart total
 * @returns {number} Cart total
 */
function calculateCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Show notification
 * @param {string} message - Notification message
 */
function showNotification(message) {
  // Check if notification container exists, if not create it
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .notification-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
      }
      
      .notification {
        background-color: var(--primary-color);
        color: var(--text-color);
        padding: 15px 20px;
        border-radius: var(--border-radius-md);
        margin-top: 10px;
        box-shadow: var(--shadow-md);
        transform: translateX(100%);
        animation: slide-in 0.3s forwards, slide-out 0.3s 3s forwards;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .notification-close {
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        font-size: 16px;
        margin-left: 10px;
      }
      
      @keyframes slide-in {
        100% { transform: translateX(0); }
      }
      
      @keyframes slide-out {
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  
  // Create notification content
  const content = document.createElement('div');
  content.textContent = message;
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'notification-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    notification.remove();
  });
  
  // Append content and close button to notification
  notification.appendChild(content);
  notification.appendChild(closeButton);
  
  // Append notification to container
  notificationContainer.appendChild(notification);
  
  // Remove notification after animation
  setTimeout(() => {
    notification.remove();
  }, 3300);
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});