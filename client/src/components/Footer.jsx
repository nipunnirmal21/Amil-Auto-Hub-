import Brand from './Brand';
import { business } from '../data/business';
import ContactAction from './ContactAction';

export default function Footer() {
  return (
    <>
      <div className="closing-strip">
        <div className="container">
          <span>YOUR VEHICLE CALLED.</span>
          <strong>IT WANTS BETTER PARTS.</strong>
          <a href="#contact">Contact us ↗</a>
        </div>
      </div>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Brand />
            <p>Quality parts. Honest advice.<br />{business.tagline}</p>
          </div>
          <div>
            <h3>Take a look</h3>
            <a href="#top">Home</a>
            <a href="#top">About us</a>
            <a href="#products">Products</a>
            <a href="#contact">Contact</a>
          </div>
          <div>
            <h3>Let's connect</h3>
            <a href={business.facebook} target="_blank" rel="noopener noreferrer">Facebook ↗</a>
            <a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <a href={business.tiktok} target="_blank" rel="noopener noreferrer">TikTok ↗</a>
            <a href={business.website} target="_blank" rel="noopener noreferrer">amilautohub.com ↗</a>
            <ContactAction>WhatsApp</ContactAction>
            <p><a href={business.phoneLink}>{business.phone}</a> · {business.phoneInternational}<br />{business.address}</p>
          </div>
          <div className="footer-message">
            <span>SRI LANKA</span>
            <h3>HERE FOR YOUR<br />NEXT MILE.</h3>
          </div>
        </div>
        <div className="container footer-bottom">
          © 2026 {business.name}. All Rights Reserved.
          <span>{business.tagline.toUpperCase()}</span>
        </div>
      </footer>
      <ContactAction className="floating-whatsapp"><span>Chat with us</span></ContactAction>
    </>
  );
}
