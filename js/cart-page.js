/**
 * Cart page functionality for the jewelry e-commerce store
 */

document.addEventListener('DOMContentLoaded', () => {
  // Render cart items
  renderCartItems();
  
  // Update cart summary
  updateCartSummary();
  
  // Add event listener to checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // If cart is empty, show notification
      if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
      }
      
      // Otherwise, go to checkout page
      window.location.href = 'checkout.html';
    });
  }
});

/**
 * Render cart items
 */
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  
  if (!cartItemsContainer) return;
  
  // Clear container
  cartItemsContainer.innerHTML = '';
  
  // Check if cart is empty
  if (cart.length === 0) {
    const emptyCart = document.createElement('div');
    emptyCart.className = 'empty-cart';
    emptyCart.innerHTML = `
      <i class="fas fa-shopping-bag"></i>
      <p>Your cart is empty</p>
      <a href="collections.html" class="btn btn-primary">Continue Shopping</a>
    `;
    
    cartItemsContainer.appendChild(emptyCart);
    return;
  }
  
  // Render cart items
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h3 class="cart-item-name">${item.name}</h3>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99">
          <button class="quantity-btn increase">+</button>
        </div>
      </div>
      <div class="cart-item-total">
        $${(item.price * item.quantity).toFixed(2)}
        <div class="cart-item-remove"><i class="fas fa-trash-alt"></i></div>
      </div>
    `;
    
    // Add event listeners for quantity buttons
    const decreaseBtn = cartItem.querySelector('.decrease');
    const increaseBtn = cartItem.querySelector('.increase');
    const quantityInput = cartItem.querySelector('.quantity-input');
    const removeBtn = cartItem.querySelector('.cart-item-remove');
    
    decreaseBtn.addEventListener('click', () => {
      if (item.quantity > 1) {
        updateCartItemQuantity(item.id, item.quantity - 1);
      }
    });
    
    increaseBtn.addEventListener('click', () => {
      updateCartItemQuantity(item.id, item.quantity + 1);
    });
    
    quantityInput.addEventListener('change', () => {
      const newQuantity = parseInt(quantityInput.value);
      if (newQuantity >= 1) {
        updateCartItemQuantity(item.id, newQuantity);
      } else {
        quantityInput.value = item.quantity;
      }
    });
    
    removeBtn.addEventListener('click', () => {
      removeFromCart(item.id);
    });
    
    cartItemsContainer.appendChild(cartItem);
  });
}

/**
 * Update cart summary
 */
function updateCartSummary() {
  const subtotalElement = document.getElementById('cart-subtotal');
  const shippingElement = document.getElementById('cart-shipping');
  const taxElement = document.getElementById('cart-tax');
  const totalElement = document.getElementById('cart-total');
  
  if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return;
  
  // Calculate values
  const subtotal = calculateCartTotal();
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  // Update elements
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  shippingElement.textContent = `$${shipping.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;
}