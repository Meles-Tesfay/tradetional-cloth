import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, cartTotal, removeFromCart, updateQuantity } = useShop();

  return (
    <>
      <div className={`cart-overlay ${cartOpen ? 'active' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-label="Shopping Cart">
        <div className="cart-drawer-header">
          <span className="cart-drawer-title">Your Cart</span>
          <button className="nav-icon-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={56} strokeWidth={1} className="cart-empty-icon" />
              <div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Your cart is empty</p>
                <p style={{ fontSize: 13 }}>Add something beautiful to get started</p>
              </div>
              <button
                className="btn-primary btn-sm"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  onError={e => { e.target.style.background = 'var(--cream-2)'; }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-sub">{item.category}</div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus size={12} />
                    </button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
              Shipping & taxes calculated at checkout
            </p>
            <button className="btn-primary checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
