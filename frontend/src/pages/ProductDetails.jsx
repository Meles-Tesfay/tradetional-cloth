import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ChevronRight, Star, Heart, ShoppingBag, Truck, Shield, RotateCcw, CheckCircle, Info } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart, wishlist, toggleWishlist, loading } = useShop();
  
  const product = products.find(p => (p.id === Number(id) || p._id === id));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // details, shipping, reviews
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Reset state when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [product]);

  if (loading) {
    return <div className="product-page-loading"><div className="pf-spinner" /></div>;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary btn-gold" style={{ marginTop: 24, display: 'inline-flex' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id || product._id);
  
  // Simulate a gallery since we only have 1 image per product
  const getGallery = () => {
    const gallery = [product.image];
    if (product.category === "Women's Kemis" || product.category === "Bridal Collection") {
      gallery.push('/assets/fabric_texture.png');
    }
    return gallery;
  };
  const images = getGallery();

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, selectedSize, selectedColor });
  };

  // Related products (same category or gender)
  const related = products.filter(p => 
    (p.id !== product.id && p._id !== product._id) && 
    (p.category === product.category || p.gender === product.gender)
  ).slice(0, 4);

  // Category specific info rendering
  const renderCategoryInfo = () => {
    switch (product.category) {
      case "Women's Kemis":
        return (
          <div className="cat-info-block">
            <h4><Info size={16}/> Artisanal Details</h4>
            <p><strong>Tilet Embroidery:</strong> Intricate handwoven patterns symbolizing Ethiopian heritage.</p>
            <p><strong>Fabric:</strong> 100% natural, hand-dyed Ethiopian cotton.</p>
            <p><strong>Care:</strong> Dry clean only to preserve the delicate gold threading.</p>
          </div>
        );
      case "Men's Traditional":
        return (
          <div className="cat-info-block">
            <h4><Info size={16}/> Traditional Significance</h4>
            <p><strong>Design:</strong> Crafted for ceremonial and festive occasions, reflecting masculine elegance.</p>
            <p><strong>Fit:</strong> Tailored for a structured yet comfortable drape.</p>
            <p><strong>Care:</strong> Machine wash cold on gentle cycle, line dry.</p>
          </div>
        );
      case "Bridal Collection":
        return (
          <div className="cat-info-block">
            <h4><Info size={16}/> Bridal Craftsmanship</h4>
            <p><strong>Bespoke Quality:</strong> Takes up to 14 days of dedicated handweaving by master artisans.</p>
            <p><strong>Details:</strong> Features heavy gold thread Tilet, exclusive to our premium bridal tier.</p>
            <p><strong>Consultation:</strong> Contact our team for precise measurements and custom adjustments.</p>
          </div>
        );
      case "Children's Wear":
        return (
          <div className="cat-info-block">
            <h4><Info size={16}/> Kid-Friendly Design</h4>
            <p><strong>Comfort:</strong> Ultra-soft, breathable cotton suitable for sensitive skin.</p>
            <p><strong>Fit:</strong> Relaxed cut to allow for movement and growth.</p>
            <p><strong>Family Match:</strong> Designed to perfectly coordinate with adult pieces for family events.</p>
          </div>
        );
      case "Accessories":
        return (
          <div className="cat-info-block">
            <h4><Info size={16}/> Handmade Heritage</h4>
            <p><strong>Crafting:</strong> Hand-hammered by silversmiths in Lalibela.</p>
            <p><strong>Material:</strong> Authentic sterling silver and traditional Ethiopian trade beads.</p>
            <p><strong>Care:</strong> Polish regularly with a soft cloth; avoid prolonged exposure to water.</p>
          </div>
        );
      default:
        return (
          <div className="cat-info-block">
            <h4><Info size={16}/> Product Info</h4>
            <p><strong>Origin:</strong> {product.origin || 'Addis Ababa, Ethiopia'}</p>
            <p><strong>Material:</strong> {product.material || 'Premium Handwoven Cotton'}</p>
          </div>
        );
    }
  };

  return (
    <main className="product-page">
      {/* Breadcrumbs */}
      <div className="pd-breadcrumbs">
        <div className="container">
          <Link to="/">Home</Link> <ChevronRight size={14} /> 
          <span className="pd-crumb-current">{product.category}</span> <ChevronRight size={14} />
          <span className="pd-crumb-current" style={{color: 'var(--charcoal)'}}>{product.name}</span>
        </div>
      </div>

      <div className="container pd-main">
        {/* Gallery */}
        <div className="pd-gallery">
          <div className="pd-thumbnails">
            {images.map((img, i) => (
              <button 
                key={i} 
                className={`pd-thumb ${selectedImage === i ? 'active' : ''}`}
                onClick={() => setSelectedImage(i)}
              >
                <img src={img} alt={`Thumbnail ${i+1}`} />
              </button>
            ))}
          </div>
          <div 
            className="pd-main-img-wrap"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              src={images[selectedImage]} 
              alt={product.name} 
              className={`pd-main-img ${isZoomed ? 'zoomed' : ''}`} 
              style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
            />
            {product.badge && <span className={`pd-badge badge-${product.badge}`}>{product.badge}</span>}
          </div>
        </div>

        {/* Info */}
        <div className="pd-info">
          <div className="pd-header">
            <h1 className="pd-title">{product.name}</h1>
            <div className="pd-meta-row">
              <div className="pd-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(product.rating || 5) ? 'var(--gold)' : 'none'} color={i < Math.round(product.rating || 5) ? 'var(--gold)' : 'var(--muted)'} />
                  ))}
                </div>
                <span>({product.reviews || 0} reviews)</span>
              </div>
              <span className="pd-sku">SKU: {product.sku || `HH-${product.id}`}</span>
            </div>
          </div>

          <div className="pd-price-wrap">
            {product.oldPrice && <span className="pd-price-old">${product.oldPrice}</span>}
            <span className="pd-price">${product.price}</span>
            {product.oldPrice && <span className="pd-discount-badge">Save ${(product.oldPrice - product.price).toFixed(2)}</span>}
          </div>

          <p className="pd-desc">{product.description}</p>

          <div className="pd-stock-status">
            {product.status === 'out' ? (
              <span className="status-badge badge-pending">Out of Stock</span>
            ) : product.status === 'low' ? (
              <span className="status-badge badge-processing">Low Stock ({(product.stock || 3)} remaining)</span>
            ) : (
              <span className="status-badge badge-delivered"><CheckCircle size={14} /> In Stock & Ready to Ship</span>
            )}
          </div>

          {/* Variations */}
          <div className="pd-variations">
            {product.colors && product.colors.length > 0 && (
              <div className="pd-var-group">
                <div className="pd-var-label">Color: <span style={{fontWeight: 600, color: 'var(--charcoal)'}}>{selectedColor}</span></div>
                <div className="pd-swatch-list">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      className={`pd-swatch ${selectedColor === c ? 'active' : ''}`}
                      style={{ background: c === 'silver' ? '#C0C0C0' : c === 'gold' ? '#C9A84C' : c }}
                      onClick={() => setSelectedColor(c)}
                      aria-label={`Select color ${c}`}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="pd-var-group">
                <div className="pd-var-label">Size: <span style={{fontWeight: 600, color: 'var(--charcoal)'}}>{selectedSize}</span></div>
                <div className="pd-size-list">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`pd-size-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button className="pd-size-guide-btn">Size Guide</button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pd-actions">
            <div className="pd-qty-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            
            <button 
              className="btn-primary btn-gold pd-add-btn" 
              onClick={handleAddToCart}
              disabled={product.status === 'out'}
            >
              <ShoppingBag size={18} /> 
              {product.status === 'out' ? 'Sold Out' : 'Add to Cart'}
            </button>
            
            <button 
              className={`pd-wish-btn ${isWishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id || product._id)}
              aria-label="Wishlist"
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          <button className="btn-primary pd-buy-now" disabled={product.status === 'out'}>
            Buy it now
          </button>

          {/* Category Info */}
          <div className="pd-category-info">
            {renderCategoryInfo()}
          </div>
          
          <div className="pd-trust-badges">
            <div className="pd-trust-item"><Truck size={18}/> <span>Free shipping over $250</span></div>
            <div className="pd-trust-item"><Shield size={18}/> <span>100% Secure Checkout</span></div>
            <div className="pd-trust-item"><RotateCcw size={18}/> <span>30-Day Returns</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="pd-tabs-section container">
        <div className="pd-tab-headers">
          {['details', 'shipping', 'reviews'].map(tab => (
            <button 
              key={tab} 
              className={`pd-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="pd-tab-content">
          {activeTab === 'details' && (
            <div className="pd-tab-pane animate-fade-up">
              <h3>Product Specifications</h3>
              <p>{product.description}</p>
              <ul className="pd-spec-list">
                <li><strong>Origin:</strong> {product.origin || 'Addis Ababa, Ethiopia'}</li>
                <li><strong>Material:</strong> {product.material || '100% Handwoven Cotton'}</li>
                <li><strong>Artisan Crafted:</strong> Each piece is unique and may have slight variations</li>
                {product.tags && <li><strong>Tags:</strong> {product.tags.join(', ')}</li>}
              </ul>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="pd-tab-pane animate-fade-up">
              <h3>Shipping & Returns</h3>
              <p><strong>Shipping:</strong> We offer worldwide shipping to over 60 countries. Standard shipping takes 7-14 business days, while express options are available at checkout (3-5 days).</p>
              <p><strong>Processing Time:</strong> As many of our items are handcrafted or finished to order, please allow 2-4 days for processing before your item ships (10-14 days for bridal/custom items).</p>
              <p><strong>Returns:</strong> We accept returns within 30 days of delivery for standard items in unworn condition. Custom tailored items and bridal wear are final sale unless there is a defect in craftsmanship.</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="pd-tab-pane animate-fade-up">
              <div className="pd-reviews-header">
                <h3>Customer Reviews</h3>
                <div className="pd-rating-summary">
                  <div className="pd-rating-big">{product.rating ? product.rating.toFixed(1) : '5.0'}</div>
                  <div>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
                      ))}
                    </div>
                    <div className="pd-review-count">Based on {product.reviews || 0} reviews</div>
                  </div>
                </div>
              </div>
              
              <div className="pd-review-list">
                {product.reviews > 0 ? (
                  <div className="pd-review-item">
                    <div className="stars" style={{marginBottom: 8}}>
                       {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
                      ))}
                    </div>
                    <p style={{fontWeight: 600, marginBottom: 4}}>Absolutely beautiful craftsmanship!</p>
                    <p style={{fontSize: 14, color: 'var(--warm-gray)', marginBottom: 8}}>The detailing on this {product.category.toLowerCase()} is stunning. I wore it to a recent family event and received so many compliments. It fits perfectly and you can feel the quality of the handwoven fabric.</p>
                    <p style={{fontSize: 12, color: 'var(--muted)'}}>— Verified Buyer, 2 weeks ago</p>
                  </div>
                ) : (
                  <p>No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section pd-related container">
          <div className="section-header">
            <h2 className="section-title" style={{fontSize: 24}}>You May Also Like</h2>
          </div>
          <div className="products-grid">
            {related.map(p => (
              <ProductCard key={p.id || p._id} product={p} onQuickView={() => {}} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetails;
