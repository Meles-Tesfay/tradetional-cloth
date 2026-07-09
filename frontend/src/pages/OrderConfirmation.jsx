import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
    // If someone visits this page directly without an order, send them home
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="section" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <CheckCircle size={80} color="var(--accent)" style={{ marginBottom: 24 }} />
      <h1 className="heading-1" style={{ marginBottom: 16 }}>Order Confirmed!</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--charcoal)', marginBottom: 8 }}>
        Thank you for your purchase. 
      </p>
      <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: 32 }}>
        Your order ID is <strong>{orderId}</strong>
      </p>
      <button className="btn-primary" onClick={() => navigate('/')}>
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;
