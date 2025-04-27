

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],  // This will hold the products in the cart
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // When adding an item to the cart:
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);

      // If the item already exists, increase the quantity
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        // If it doesn't exist, add it to the cart
        state.items.push({
          ...action.payload,
          quantity: 1,  // Start with quantity of 1 for new items
        });
      }
    },

    // Remove item from cart by ID
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },

    // Increment quantity of item in cart
    incrementQuantity: (state, action) => {
      const item = state.items.find(p => p._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    // Decrement quantity of item in cart (minimum 1)
    decrementQuantity: (state, action) => {
      const item = state.items.find(p => p._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // Clear all items from the cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Export actions for use in your components
export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
