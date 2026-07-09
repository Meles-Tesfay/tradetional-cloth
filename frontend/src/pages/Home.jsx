import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Globe, Clock, Shield, Headphones, Star, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import AiAssistant from '../components/AiAssistant';
import { TESTIMONIALS } from '../data';
import { useShop } from '../context/ShopContext';

// Scroll button for products strip
const ScrollArrow = ({ dir, containerId }) => {
  const scroll = () => {
    const el = document.getElementById(containerId);
    if (el) el.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };
  return (
    <button
      onClick={scroll}
      aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
      style={{
        width: 40, height: 40, borderRadius: '50%',
        background: 'var(--white)', border: '1.5px solid var(--cream-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--charcoal)',
        transition: 'all .2s', flexShrink: 0,
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--charcoal)'; e.currentTarget.style.color = 'var(--white)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--charcoal)'; }}
    >
      {dir === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  );
};

const StarFill = ({ filled }) => (
  <Star size={14} fill={filled ? 'var(--gold)' : 'none'} color={filled ? 'var(--gold)' : 'var(--muted)'} />
);

const COLLECTIONS = [
  { label: "Women's", name: "Habesha Kemis", img: '/assets/hero_model.png' },
  { label: "Men's", name: "Traditional Suits", img: '/assets/mens_outfit.png' },
  { label: "Bridal", name: "Wedding Collection", img: '/assets/wedding.png' },
  { label: "Artisan", name: "Handmade Accessories", img: '/assets/accessories.png' },
];

const TREND_TABS = ["Women's", "Men's", 'Bridal', 'Accessories'];

const Home = () => {
  const { products } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [trendTab, setTrendTab] = useState(0);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.animate-fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Map TREND_TABS to gender filters
  const GENDER_MAP = { "Women's": 'women', "Men's": 'men', 'Bridal': 'women', 'Accessories': null };
  const activeGender = GENDER_MAP[TREND_TABS[trendTab]];
  const trendProducts = products
    .filter(p => activeGender === null || p.gender === activeGender || !p.gender)
    .slice(0, 8);

  return (
    <main id="main-content">
      {/* ─── HERO ─── */}
      <section className="hero" aria-label="Hero">
        <div className="hero-left">
          <span className="hero-eyebrow">Authentic · Handcrafted · Premium</span>
          <h1 className="hero-title">
            The Essence of<br /><em>Ethiopian</em> Elegance
          </h1>
          <p className="hero-desc">
            Discover our exclusive collection of premium Habesha Kemis and traditional wear,
            handwoven by master artisans in Addis Ababa — now shipping to 60+ countries.
          </p>
          <div className="hero-actions">
            <button className="btn-primary btn-gold" onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}>
              Shop the Collection
            </button>
            <button className="btn-primary btn-outline" onClick={() => document.getElementById('arrivals')?.scrollIntoView({ behavior: 'smooth' })}>
              New Arrivals
            </button>
          </div>
          <div className="hero-stats">
            {[
              { num: '500+', label: 'Artisan Partners' },
              { num: '10k+', label: 'Orders Delivered' },
              { num: '60+', label: 'Countries Shipped' },
            ].map(s => (
              <div key={s.label} className="hero-stat-item">
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-right">
          <img src="/assets/hero_model.png" alt="Woman wearing Gold Tilet Habesha Kemis" className="hero-main-img" />

          {/* Floating badges */}
          <div className="hero-badge hero-badge-1">
            <img src="/assets/fabric_texture.png" alt="Fabric" />
            <div className="hero-badge-text">
              <div className="hero-badge-title">Premium Tilet</div>
              <div className="hero-badge-sub">Gold handwoven thread</div>
              <div className="hero-badge-price">From $89</div>
            </div>
          </div>

          <div className="hero-badge hero-badge-2">
            <img src="/assets/accessories.png" alt="Accessories" />
            <div className="hero-badge-text">
              <div className="hero-badge-title">Artisan Silver Set</div>
              <div className="hero-badge-sub">Lalibela, Ethiopia</div>
              <div className="hero-badge-price">$68</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <div className="trust-strip">
        {[
          { icon: Globe, text: 'Ships to 60+ Countries' },
          { icon: Clock, text: '7–14 Day Artisan Crafting' },
          { icon: Shield, text: '100% Authentic & Handmade' },
          { icon: Headphones, text: '24/7 Customer Support' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="trust-item">
            <Icon size={15} />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* ─── COLLECTIONS ─── */}
      <section id="collections" className="section">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Explore</div>
            <h2 className="section-title">Shop by Collection</h2>
          </div>
          <a href="/#arrivals" className="link-all" onClick={(e) => { e.preventDefault(); document.getElementById('arrivals')?.scrollIntoView({ behavior: 'smooth' }); }}>
            View All <ChevronRight size={15} />
          </a>
        </div>

        <div className="collection-grid animate-fade-up">
          {COLLECTIONS.map((col, i) => (
            <div key={i} className="collection-card">
              <img src={col.img} alt={col.name} loading="lazy" />
              <div className="collection-card-overlay">
                <div className="collection-card-label">{col.label}</div>
                <div className="collection-card-name">{col.name}</div>
                <button 
                  className="collection-card-btn" 
                  onClick={() => {
                    document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
                    setTrendTab(i);
                  }}
                >
                  Shop Now <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      <section id="arrivals" className="section section-cream">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Just In</div>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ScrollArrow dir="left" containerId="arrivals-scroll" />
            <ScrollArrow dir="right" containerId="arrivals-scroll" />
          </div>
        </div>

        <div className="products-scroll" id="arrivals-scroll">
          {products.map(p => (
            <ProductCard key={p.id || p._id} product={p} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>

      {/* ─── WEDDING BANNER ─── */}
      <section className="wedding-banner" aria-label="Bridal Collection">
        <img src="/assets/wedding.png" alt="Ethiopian Bridal Kemis" />
        <div className="wedding-banner-content">
          <div className="wedding-banner-eyebrow">✦ Limited Bridal Collection ✦</div>
          <h2 className="wedding-banner-title">Your Perfect<br />Wedding Kemis</h2>
          <p className="wedding-banner-subtitle">
            Bespoke, handcrafted bridal Habesha Kemis made to your exact measurements.
            Every stitch tells a story of love and heritage.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/#collections" className="btn-primary btn-gold" style={{ display: 'inline-flex', alignItems: 'center' }}>Explore Bridal</a>
            <button
              className="btn-primary"
              style={{ background: 'rgba(255,255,255,.12)', borderColor: 'rgba(255,255,255,.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => setAiOpen(true)}
            >
              Custom Tailoring
            </button>
          </div>
        </div>
      </section>

      {/* ─── AI ASSISTANT PROMO ─── */}
      <section className="section">
        <div
          style={{
            background: 'linear-gradient(135deg, var(--charcoal) 0%, #2C2416 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '56px 64px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 48,
            alignItems: 'center',
          }}
          className="animate-fade-up ai-promo-box"
        >
          <div className="ai-promo-content" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>AI Style Assistant</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 12, lineHeight: 1.2, letterSpacing: '-.02em' }}>
              Your Personal<br />Ethiopian Fashion Advisor
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 480 }}>
              Not sure which dress to choose for your occasion? Our AI styling assistant
              knows Ethiopian fashion inside and out — ask anything, from sizing to Tilet patterns.
            </p>
          </div>
          <div>
            <button
              className="btn-primary btn-gold"
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => setAiOpen(true)}
            >
              <Sparkles size={15} /> Try Style AI
            </button>
          </div>
        </div>
      </section>

      {/* ─── TRENDING ─── */}
      <section id="trending" className="section section-cream">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">What's Hot</div>
            <h2 className="section-title">Trending Now</h2>
          </div>
        </div>

        <div className="tab-bar">
          {TREND_TABS.map((t, i) => (
            <button
              key={t}
              className={`tab-btn ${trendTab === i ? 'active' : ''}`}
              onClick={() => setTrendTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="products-grid trending-grid">
          {trendProducts.map((p, rank) => (
            <div key={p.id} style={{ position: 'relative' }}>
              <span className="trend-rank">#{rank + 1}</span>
              <ProductCard product={p} onQuickView={setQuickViewProduct} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section id="story" className="section">
        <div className="story-layout animate-fade-up">
          <div className="story-imgs">
            <img src="/assets/mens_outfit.png" alt="Ethiopian artisan" className="story-img-main" loading="lazy" />
            <img src="/assets/fabric_texture.png" alt="Handwoven Tilet fabric" className="story-img-inset" loading="lazy" />
          </div>
          <div className="story-text">
            <div className="section-eyebrow">Our Heritage</div>
            <h2 className="section-title" style={{ marginBottom: 24 }}>Handcrafted with<br />Ancient Traditions</h2>
            <p>
              For centuries, Ethiopian weavers have created some of the world's most intricate textiles. The art of Tilet — the hand-embroidered geometric patterns that adorn every Habesha Kemis — is passed down from mother to daughter across generations.
            </p>
            <p>
              At Habesha Heritage, we partner directly with over 500 master artisans across Addis Ababa, Gondar, Lalibela, and Axum, ensuring fair wages and preserving these ancient techniques for the world to cherish.
            </p>
            <div className="story-pillars">
              {[
                { icon: '✦', title: 'Master Artisans', desc: 'Each piece is handcrafted by certified artisan partners' },
                { icon: '♻', title: 'Sustainable', desc: '100% natural, hand-dyed Ethiopian cotton' },
                { icon: '🌍', title: 'Global Reach', desc: 'Shipped to 60+ countries worldwide' },
                { icon: '💛', title: 'Fair Trade', desc: 'Directly supporting Ethiopian craftspeople' },
              ].map(p => (
                <div key={p.title} className="story-pillar">
                  <div className="story-pillar-icon">{p.icon}</div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section section-cream" id="reviews">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Customer Love</div>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="testimonial-card animate-fade-up">
              <div className="testimonial-stars">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div
                  className="testimonial-avatar"
                  style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: 'white',
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-location">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SHIPPING ─── */}
      <section className="section shipping-section">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <div className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Global Delivery</div>
            <h2 className="section-title">Why Shop with Us</h2>
          </div>
        </div>
        <div className="shipping-grid">
          {[
            { icon: Globe, title: '60+ Countries', desc: 'We ship authentic Ethiopian clothing worldwide, to every corner of the diaspora.' },
            { icon: Shield, title: 'Quality Guaranteed', desc: 'Every piece undergoes strict quality checks before leaving our artisan workshops.' },
            { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated team is always available to assist with sizing, customs, and care.' },
            { icon: RotateCcwIcon, title: 'Easy Returns', desc: '30-day hassle-free returns on all standard orders. Custom pieces are final sale.' },
          ].map(({ icon: Icon, ...item }) => (
            <div key={item.title} className="shipping-item animate-fade-up">
              <div className="shipping-icon"><Icon size={28} /></div>
              <div className="shipping-title">{item.title}</div>
              <p className="shipping-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="newsletter-section">
        <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: 12 }}>Stay Connected</div>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 12 }}>Join 25,000+ Fashion Lovers</h2>
        <p style={{ color: 'var(--warm-gray)', fontSize: 15, textAlign: 'center', maxWidth: 440, margin: '0 auto' }}>
          Get early access to new collections, exclusive discounts, and artisan stories straight to your inbox.
        </p>
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target.querySelector('input');
            if (input) input.value = '';
            alert('Thank you for subscribing! 🎉');
          }}
        >
          <input type="email" placeholder="Enter your email address" required aria-label="Email for newsletter" />
          <button type="submit" className="btn-primary btn-gold">Subscribe</button>
        </form>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, textAlign: 'center' }}>
          No spam. Unsubscribe anytime. By subscribing you agree to our Privacy Policy.
        </p>
      </section>

      {/* ─── Modals ─── */}
      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
      <AiAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </main>
  );
};

// Inline icon that doesn't cause import issues
const RotateCcwIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-3.36" />
  </svg>
);

export default Home;
