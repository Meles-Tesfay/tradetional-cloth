import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Checkout = () => {
  const { cart, cartTotal, placeOrder, showToast } = useShop();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Your cart is empty</h2>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: 24 }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await placeOrder(formData);
      navigate('/order-confirmation', { state: { orderId: order.orderId } });
    } catch (err) {
      // Toast is already shown in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <h1 className="heading-1" style={{ marginBottom: 32 }}>Checkout</h1>
      
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        {/* Form Column */}
        <div style={{ flex: '1 1 400px' }}>
          <h2 className="heading-3" style={{ marginBottom: 24 }}>Shipping Details</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                required 
                name="customerName" 
                value={formData.customerName} 
                onChange={handleChange} 
                className="form-input" 
                placeholder="Abeba Alemu"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                required 
                type="email" 
                name="customerEmail" 
                value={formData.customerEmail} 
                onChange={handleChange} 
                className="form-input" 
                placeholder="abeba@example.com"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                required 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="form-input" 
                placeholder="+251 911 234 567"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <textarea 
                required 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className="form-input" 
                rows="3"
                placeholder="Bole, Addis Ababa"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ padding: '16px', fontSize: '1rem', marginTop: 12 }}
            >
              {loading ? 'Processing...' : `Place Order ($${cartTotal.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Summary Column */}
        <div style={{ flex: '1 1 300px', backgroundColor: 'var(--cream-2)', padding: 32, borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
          <h3 className="heading-3" style={{ marginBottom: 24 }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 24 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.2rem' }}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
