import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Heart, ShoppingBag, Star, Package, Truck, RotateCcw } from 'lucide-react';
import { getImageUrl } from '../utils/helpers';

const QuickView = ({ product, onClose }) => {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = wishlist.includes(product?.id);

  useEffect(() => {
    setSelectedSize(0);
    setSelectedColor(0);
    setQuantity(1);
  }, [product]);

  // Trap key events
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    addToCart({ ...product, quantity });
    onClose();
  };

  return (
    <div
      className="modal-backdrop active"
      role="dialog"
      aria-modal
      aria-label={`Quick view: ${product.name}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="quick-view-content">
        {/* Image side */}
        <div className="qv-img-side">
          <img src={getImageUrl(product.image)} alt={product.name} />
          <button className="qv-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Info side */}
        <div className="qv-info">
          <div className="qv-category">{product.category}</div>
          <h2 className="qv-title">{product.name}</h2>

          <div className="qv-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 4 }}>
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="qv-price-row">
            <span className="qv-price">${product.price}</span>
            {product.oldPrice && (
              <span className="qv-price-old">${product.oldPrice}</span>
            )}
          </div>

          <p style={{ fontSize: 13.5, color: 'var(--warm-gray)', lineHeight: 1.75, marginBottom: 20 }}>
            {product.description}
          </p>

          <div className="qv-divider" />

          {/* Size */}
          {product.sizes && (
            <>
              <div className="qv-label">Size</div>
              <div className="qv-sizes">
                {product.sizes.map((s, i) => (
                  <button
                    key={s}
                    className={`size-btn ${i === selectedSize ? 'active' : ''}`}
                    onClick={() => setSelectedSize(i)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Color */}
          {product.colors && (
            <>
              <div className="qv-label">Color</div>
              <div className="qv-colors">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    className={`swatch ${i === selectedColor ? 'active' : ''}`}
                    style={{
                      width: 26, height: 26,
                      background: c === 'silver' ? '#C0C0C0' : c === 'gold' ? '#C9A84C' : c,
                      border: '2px solid rgba(0,0,0,.1)',
                    }}
                    onClick={() => setSelectedColor(i)}
                    aria-label={`Color ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="qv-divider" />

          {/* Trust badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {[
              { icon: Package, text: 'Handcrafted · Ships in 7-14 days' },
              { icon: Truck, text: 'Free worldwide shipping over $250' },
              { icon: RotateCcw, text: '30-day hassle-free returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--warm-gray)' }}>
                <Icon size={14} color="var(--gold-dark)" />
                {text}
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="btn-primary qv-add-btn" onClick={handleAdd}>
            <ShoppingBag size={16} /> Add to Cart
          </button>
          <button
            className={`qv-wish-btn ${isWishlisted ? 'active' : ''}`}
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
            {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
