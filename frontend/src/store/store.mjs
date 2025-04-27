

import { configureStore } from '@reduxjs/toolkit'
import  authReducer  from './authSlice.mjs'
import cartReducer from './cartSlice.mjs'; // ✅ Add this line
import taskReducer from './taskSlice';



export const store = configureStore({
  reducer: {
    auth:authReducer,
    cart: cartReducer, // ✅ Register the cart slice
    tasks: taskReducer

  },
})
