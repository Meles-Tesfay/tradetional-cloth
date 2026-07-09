import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import ProtectedRoute from './components/ProtectedRoute';

// Wrapper to conditionally render Footer
const Layout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/account');

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <Layout />
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
