import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SocialIcon = ({ d }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const SOCIALS = [
  "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", // Facebook
  "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z", // Twitter
  "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M6.5 2h11a5 5 0 0 1 5 5v11a5 5 0 0 1-5 5h-11a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" // Instagram
];

const Footer = () => {
  const handleNewsletter = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input) input.value = '';
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="footer-logo">Habesha <em>Heritage</em></div>
          <p className="footer-desc">
            Curating the finest traditional Ethiopian clothing, handcrafted by master artisans in Addis Ababa and beyond. Bringing authentic heritage to the world.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {SOCIALS.map((path, i) => {
              const links = ['https://facebook.com', 'https://twitter.com', 'https://instagram.com'];
              return (
              <a
                key={i}
                href={links[i]}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 36, height: 36, background: 'rgba(255,255,255,.06)',
                  borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,.45)', transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,.15)'; e.currentTarget.style.color = 'var(--gold-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = 'rgba(255,255,255,.45)'; }}
              >
                <SocialIcon d={path} />
              </a>
              )
            })}
          </div>
        </div>

        <div>
          <h4 className="footer-heading">Shop</h4>
          <ul className="footer-links">
            {["Women's Kemis", "Men's Traditional", 'Bridal Collection', "Children's Wear", 'Accessories', 'Custom Tailoring'].map(l => (
              <li key={l}><a href="/#collections">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            {['Our Story', 'Artisan Partners', 'Sustainability', 'Careers', 'Press & Media', 'Sell With Us'].map((l, i) => (
              <li key={l}>
                {l === 'Sell With Us' ? (
                  <Link to="/dashboard">{l}</Link>
                ) : (
                  <a href={i < 3 ? "/#story" : "/#main-content"}>{l}</a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Stay in Touch</h4>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, marginBottom: 16 }}>
            Subscribe for exclusive new arrivals, artisan stories, and early access to sales.
          </p>
          <form onSubmit={handleNewsletter}>
            <div className="footer-nl-input">
              <input type="email" placeholder="Your email address" required aria-label="Email for newsletter" />
              <button type="submit" className="footer-nl-btn" aria-label="Subscribe">
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.25)', marginTop: 10 }}>
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Habesha Heritage. All rights reserved.</span>
        <div className="footer-bottom-links">
          <a href="/#main-content">Privacy Policy</a>
          <a href="/#main-content">Terms of Service</a>
          <a href="/#main-content">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
