

import React from 'react';
import './App.css'

import { Routes, Route, useLocation  } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Navigation from './components/Navigation';
import Contact from './Pages/Contact.jsx';
import About from './Pages/About.jsx';
import Footer from './components/Footer';
import LoginPage from './Pages/LoginPage.jsx';
import SignUp from './Pages/Signup.jsx';
import Cart from './Pages/Cart.jsx';
import Logout from './Pages/Logout.jsx';
import Profile from './Pages/Profile.jsx';
import AdminPage from './Pages/AdminPage.jsx';
import Task from './Pages/Task.jsx';
import Update from './Pages/Update.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const location = useLocation();
  const adminPage = location.pathname === '/admin'; 
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    
      {!adminPage && <Navigation />} 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path='/task' element={<Task />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update" element={<Update />} />
    </Routes>
    {!adminPage && <Footer />}
    </>
  );
};

export default App;
