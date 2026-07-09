import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/helpers';

const BADGE_LABELS = {
  bestseller: 'Bestseller',
  new: 'New',
  sale: 'Sale',
};

const ProductCard = ({ product, onQuickView }) => {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const isWishlisted = wishlist.includes(product.id);
  const [selectedColor, setSelectedColor] = useState(0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id || product._id}`} className="product-img-wrap" style={{ display: 'block' }}>
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          onError={e => { e.target.style.opacity = 0; }}
        />

        {product.badge && (
          <span className={`product-badge badge-${product.badge}`}>
            {BADGE_LABELS[product.badge]}
          </span>
        )}

        <button
          className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id || product._id); }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        <div className="product-hover-overlay">
          <button
            className="product-quick-view"
            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
          >
            Quick View
          </button>
          <button
            className="product-cart-btn-img"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <ShoppingBag size={17} />
          </button>
        </div>
      </Link>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link to={`/product/${product.id || product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <div className="product-rating" style={{ marginBottom: 8 }}>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="rating-count">({product.reviews})</span>
        </div>

        <div className="product-meta">
          <div className="product-price">
            {product.oldPrice && <span className="price-old">${product.oldPrice}</span>}
            ${product.price}
          </div>
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="product-swatches">
            {product.colors.map((c, i) => (
              <button
                key={i}
                className={`swatch ${i === selectedColor ? 'active' : ''}`}
                style={{ background: c === 'silver' ? '#C0C0C0' : c === 'gold' ? '#C9A84C' : c }}
                onClick={() => setSelectedColor(i)}
                aria-label={`Color option ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
