/**
 * Checkout page functionality for the jewelry e-commerce store
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize checkout
  initCheckout();
  
  // Update order summary
  updateOrderSummary();
  
  // Add event listeners to checkout forms
  setupFormEventListeners();
});

/**
 * Initialize checkout
 */
function initCheckout() {
  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  // Render checkout items
  renderCheckoutItems();
}

/**
 * Render checkout items in order summary
 */
function renderCheckoutItems() {
  const checkoutItemsContainer = document.getElementById('checkout-items');
  
  if (!checkoutItemsContainer) return;
  
  // Clear container
  checkoutItemsContainer.innerHTML = '';
  
  // Render checkout items
  cart.forEach(item => {
    const checkoutItem = document.createElement('div');
    checkoutItem.className = 'checkout-item';
    
    checkoutItem.innerHTML = `
      <div class="checkout-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="checkout-item-details">
        <div class="checkout-item-name">${item.name}</div>
        <div class="checkout-item-price">
          <span>Qty: ${item.quantity}</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    `;
    
    checkoutItemsContainer.appendChild(checkoutItem);
  });
}

/**
 * Update order summary
 * @param {string} shippingMethod - Shipping method
 */
function updateOrderSummary(shippingMethod = 'standard') {
  const subtotalElement = document.getElementById('checkout-subtotal');
  const shippingElement = document.getElementById('checkout-shipping');
  const taxElement = document.getElementById('checkout-tax');
  const totalElement = document.getElementById('checkout-total');
  
  if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return;
  
  // Calculate values
  const subtotal = calculateCartTotal();
  
  // Set shipping cost based on selected shipping method
  let shipping = 9.99; // Default to standard shipping
  
  if (shippingMethod === 'express') {
    shipping = 19.99;
  } else if (shippingMethod === 'overnight') {
    shipping = 29.99;
  }
  
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  // Update elements
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  shippingElement.textContent = `$${shipping.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Setup form event listeners
 */
function setupFormEventListeners() {
  // Shipping form
  const shippingForm = document.getElementById('shipping-form');
  if (shippingForm) {
    shippingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Update progress
      updateCheckoutProgress('payment');
      
      // Show payment form
      showCheckoutForm('payment');
    });
    
    // Update shipping cost when shipping method changes
    const shippingMethodInputs = shippingForm.querySelectorAll('input[name="shippingMethod"]');
    shippingMethodInputs.forEach(input => {
      input.addEventListener('change', () => {
        updateOrderSummary(input.value);
      });
    });
  }
  
  // Payment form
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Update progress
      updateCheckoutProgress('review');
      
      // Show review form
      showCheckoutForm('review');
      
      // Update review information
      updateReviewInformation();
    });
    
    // Back to shipping button
    const backToShippingBtn = document.getElementById('back-to-shipping');
    if (backToShippingBtn) {
      backToShippingBtn.addEventListener('click', () => {
        // Update progress
        updateCheckoutProgress('shipping');
        
        // Show shipping form
        showCheckoutForm('shipping');
      });
    }
    
    // Same as shipping checkbox
    const sameAsShippingCheckbox = document.getElementById('sameAsShipping');
    const billingAddressFields = document.getElementById('billing-address-fields');
    
    if (sameAsShippingCheckbox && billingAddressFields) {
      sameAsShippingCheckbox.addEventListener('change', () => {
        billingAddressFields.style.display = sameAsShippingCheckbox.checked ? 'none' : 'block';
      });
    }
  }
  
  // Back to payment button
  const backToPaymentBtn = document.getElementById('back-to-payment');
  if (backToPaymentBtn) {
    backToPaymentBtn.addEventListener('click', () => {
      // Update progress
      updateCheckoutProgress('payment');
      
      // Show payment form
      showCheckoutForm('payment');
    });
  }
  
  // Edit buttons
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const step = button.dataset.edit;
      
      // Update progress
      updateCheckoutProgress(step);
      
      // Show corresponding form
      showCheckoutForm(step);
    });
  });
  
  // Place order button
  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      placeOrder();
    });
  }
  
  // Modal close button
  const modalCloseBtn = document.querySelector('.modal-close');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      closeOrderConfirmationModal();
    });
  }
}

/**
 * Update checkout progress
 * @param {string} step - Current step
 */
function updateCheckoutProgress(step) {
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressLines = document.querySelectorAll('.progress-line');
  
  progressSteps.forEach(stepElement => {
    const stepName = stepElement.dataset.step;
    
    if (stepName === step) {
      stepElement.classList.add('active');
      stepElement.classList.remove('completed');
    } else if (
      (step === 'payment' && stepName === 'shipping') ||
      (step === 'review' && (stepName === 'shipping' || stepName === 'payment'))
    ) {
      stepElement.classList.remove('active');
      stepElement.classList.add('completed');
    } else {
      stepElement.classList.remove('active', 'completed');
    }
  });
  
  // Update progress lines
  if (progressLines.length === 2) {
    if (step === 'payment' || step === 'review') {
      progressLines[0].classList.add('active');
    } else {
      progressLines[0].classList.remove('active');
    }
    
    if (step === 'review') {
      progressLines[1].classList.add('active');
    } else {
      progressLines[1].classList.remove('active');
    }
  }
}

/**
 * Show checkout form
 * @param {string} step - Form step to show
 */
function showCheckoutForm(step) {
  const forms = document.querySelectorAll('.checkout-form');
  
  forms.forEach(form => {
    form.classList.remove('active');
  });
  
  const formToShow = step === 'review' ? document.getElementById('order-review') : document.getElementById(`${step}-form`);
  
  if (formToShow) {
    formToShow.classList.add('active');
  }
}

/**
 * Update review information
 */
function updateReviewInformation() {
  // Update shipping information
  const shippingInfoElement = document.getElementById('review-shipping-info');
  
  if (shippingInfoElement) {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value;
    const country = document.getElementById('country').value;
    
    // Get selected shipping method
    const shippingMethodInput = document.querySelector('input[name="shippingMethod"]:checked');
    const shippingMethod = shippingMethodInput ? shippingMethodInput.value : 'standard';
    let shippingMethodText = 'Standard Shipping (5-7 business days)';
    
    if (shippingMethod === 'express') {
      shippingMethodText = 'Express Shipping (2-3 business days)';
    } else if (shippingMethod === 'overnight') {
      shippingMethodText = 'Overnight Shipping (Next business day)';
    }
    
    shippingInfoElement.innerHTML = `
      <p><strong>${fullName}</strong></p>
      <p>${address}</p>
      <p>${city}, ${state} ${zipCode}</p>
      <p>${country}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <p>Shipping Method: ${shippingMethodText}</p>
    `;
  }
  
  // Update payment information
  const paymentInfoElement = document.getElementById('review-payment-info');
  
  if (paymentInfoElement) {
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    
    // Mask card number
    const maskedCardNumber = cardNumber.replace(/\s/g, '').replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 XXXX');
    
    paymentInfoElement.innerHTML = `
      <p><strong>${cardName}</strong></p>
      <p>Card Number: ${maskedCardNumber}</p>
    `;
  }
  
  // Update order items
  const orderItemsElement = document.getElementById('review-order-items');
  
  if (orderItemsElement) {
    // Clear container
    orderItemsElement.innerHTML = '';
    
    // Render order items
    cart.forEach(item => {
      const orderItem = document.createElement('div');
      orderItem.className = 'review-item';
      
      orderItem.innerHTML = `
        <div class="review-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="review-item-details">
          <div class="review-item-name">${item.name}</div>
          <div class="review-item-price">$${item.price.toFixed(2)} each</div>
          <div class="review-item-quantity">Quantity: ${item.quantity}</div>
        </div>
      `;
      
      orderItemsElement.appendChild(orderItem);
    });
  }
}

/**
 * Place order
 */
function placeOrder() {
  // In a real application, you would send order data to a server
  // For this demo, just show confirmation modal and clear cart
  
  // Generate random order number
  const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  
  // Get customer email
  const email = document.getElementById('email').value;
  
  // Show order confirmation modal
  const orderNumberElement = document.getElementById('order-number');
  const confirmationEmailElement = document.getElementById('confirmation-email');
  const modal = document.getElementById('order-confirmation-modal');
  
  if (orderNumberElement && confirmationEmailElement && modal) {
    orderNumberElement.textContent = orderNumber;
    confirmationEmailElement.textContent = email;
    
    modal.classList.add('active');
    
    // Clear cart after order is placed
    clearCart();
  }
}

/**
 * Close order confirmation modal
 */
function closeOrderConfirmationModal() {
  const modal = document.getElementById('order-confirmation-modal');
  
  if (modal) {
    modal.classList.remove('active');
    
    // Redirect to home page
    window.location.href = '../index.html';
  }
}