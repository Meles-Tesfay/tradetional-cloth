import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { LogOut, Package, Heart, MapPin, Bell, User, Ruler, RotateCcw, Truck, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { products } = useShop(); // For wishlist hydration
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'tracking', label: 'Order Tracking', icon: Truck },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'measurements', label: 'Saved Measurements', icon: Ruler },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Profile Settings', icon: User },
    { id: 'account', label: 'Account Management', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="cd-panel animate-fade-up">
            <h2>Order History</h2>
            <div className="cd-order-list">
              <div className="cd-order-card">
                <div className="cd-order-header">
                  <div>
                    <span className="cd-order-id">Order #HH-98234</span>
                    <span className="cd-order-date">Placed on Oct 12, 2026</span>
                  </div>
                  <span className="status-badge badge-delivered">Delivered</span>
                </div>
                <div className="cd-order-items">
                  <img src="/assets/hero_model.png" alt="Kemis" />
                  <div>
                    <h4>Premium Gold Tilet Habesha Kemis</h4>
                    <p>Size: Custom | Qty: 1</p>
                    <p className="cd-order-price">$189.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tracking':
        return (
          <div className="cd-panel animate-fade-up">
            <h2>Track Active Order</h2>
            <p className="cd-subtitle">Tracking Order #HH-99120</p>
            <div className="cd-timeline">
              <div className="cd-timeline-step active">
                <div className="cd-timeline-icon"><CheckCircle size={16} /></div>
                <div className="cd-timeline-content">
                  <h4>Order Confirmed</h4>
                  <p>Oct 18, 2026 - 10:30 AM</p>
                </div>
              </div>
              <div className="cd-timeline-step active">
                <div className="cd-timeline-icon"><CheckCircle size={16} /></div>
                <div className="cd-timeline-content">
                  <h4>Artisan Weaving Started</h4>
                  <p>Oct 19, 2026 - Addis Ababa Workshop</p>
                </div>
              </div>
              <div className="cd-timeline-step pending">
                <div className="cd-timeline-icon"><div className="cd-dot" /></div>
                <div className="cd-timeline-content">
                  <h4>Quality Check & Finishing</h4>
                  <p>Estimated: Oct 24, 2026</p>
                </div>
              </div>
              <div className="cd-timeline-step pending">
                <div className="cd-timeline-icon"><Truck size={16} /></div>
                <div className="cd-timeline-content">
                  <h4>Shipped</h4>
                  <p>Awaiting dispatch via DHL</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'measurements':
        return (
          <div className="cd-panel animate-fade-up">
            <h2>Saved Measurements</h2>
            <p className="cd-subtitle">Your custom tailoring profile for bespoke orders.</p>
            <form className="cd-form" onSubmit={e => e.preventDefault()}>
              <div className="cd-grid-2">
                <div className="cd-field">
                  <label>Bust (inches)</label>
                  <input type="number" defaultValue={34} />
                </div>
                <div className="cd-field">
                  <label>Waist (inches)</label>
                  <input type="number" defaultValue={28} />
                </div>
                <div className="cd-field">
                  <label>Hips (inches)</label>
                  <input type="number" defaultValue={38} />
                </div>
                <div className="cd-field">
                  <label>Dress Length (inches)</label>
                  <input type="number" defaultValue={56} />
                </div>
              </div>
              <button className="btn-primary btn-gold" style={{ marginTop: 24 }}>Save Measurements</button>
            </form>
          </div>
        );
      default:
        return (
          <div className="cd-panel animate-fade-up">
            <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
            <p className="cd-placeholder">This section is currently under construction. Check back soon for updates!</p>
          </div>
        );
    }
  };

  return (
    <div className="customer-dashboard">
      <div className="cd-sidebar">
        <div className="cd-user-info">
          <div className="cd-avatar">{user?.name?.charAt(0) || 'C'}</div>
          <div>
            <h3>{user?.name || 'Customer'}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
        
        <nav className="cd-nav">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button 
              key={id}
              className={`cd-nav-item ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>

        <button className="cd-logout" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>
      
      <div className="cd-content-area">
        {renderContent()}
      </div>
    </div>
  );
};

// Inline icon to avoid import issues
const CheckCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default CustomerDashboard;
