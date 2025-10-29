import React from "react";
import { Link } from "react-router-dom";

const AppFooter = () => (
      <>
            <footer className="footer-simple-wrapper">
                  <div className="footer-simple-main">
                        {/* Brand */}
                        <div className="footer-simple-brand">
                              <span className="footer-simple-logo">V</span>
                              <span className="footer-simple-title">Voice of Rajkot</span>
                        </div>
                        {/* Links */}
                        <nav className="footer-simple-links">
                              <Link to="/events" className="footer-simple-link">
                                    Events
                              </Link>
                              <Link to="/refund-policies" className="footer-simple-link">
                                    Refund Policies
                              </Link>
                              <Link to="/others" className="footer-simple-link">
                                    Others
                              </Link>
                        </nav>
                        {/* Contact/Social */}
                        <div className="footer-simple-contact">
                              <a href="mailto:info@rhythmofheart.com" className="footer-simple-link">
                                    info@voiceofrajkot.com
                              </a>
                              <div className="footer-simple-socials">
                                    <a href="#" aria-label="Instagram" className="footer-simple-social">
                                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <rect x="2" y="2" width="20" height="20" rx="5" />
                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                                          </svg>
                                    </a>
                                    <a href="#" aria-label="Twitter" className="footer-simple-social">
                                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1s-4.18 1.64-6.29 2.18A4.48 4.48 0 0 0 3 7.72v.56A12.94 12.94 0 0 1 1.64 4s-4 9 5 13a13.07 13.07 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                          </svg>
                                    </a>
                              </div>
                        </div>
                  </div>
                  <div className="footer-simple-sub">© 2025 voice of rajkot. All rights reserved.</div>
            </footer>

            <style>
                  {`
.footer-simple-wrapper {
  z-index: -1;
  background: #f9fafb;
  border-top: 3px solid;
  border-image: linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%) 1;
  color: #232946;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  // margin-top: 3rem;
  box-shadow: 0 4px 24px 0 #6366f11a;
}
.footer-simple-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.2rem 1.5rem 1.2rem 1.5rem;
  flex-wrap: wrap;
  gap: 2rem;
  font-size: 1.13rem;
}
.footer-simple-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.footer-simple-logo {
  background: #6366f1;
  color: #fff;
  font-weight: 900;
  font-size: 2.1rem;
  border-radius: 50%;
  width: 2.7rem;
  height: 2.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-simple-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3730a3;
  letter-spacing: 0.02em;
}
.footer-simple-links {
  display: flex;
  gap: 1.7rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.footer-simple-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.09rem;
  position: relative;
  transition: color 0.18s;
  padding: 0.2rem 0.1rem;
}
.footer-simple-link::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  background: #6366f1;
  transition: width 0.25s;
  border-radius: 2px;
  margin-top: 2px;
}
.footer-simple-link:hover {
  color: #3730a3;
}
.footer-simple-link:hover::after {
  width: 100%;
}
.footer-simple-contact {
  display: flex;
  align-items: center;
  gap: 1.3rem;
  flex-wrap: wrap;
}
.footer-simple-socials {
  display: flex;
  gap: 0.7rem;
}
.footer-simple-social {
  color: #6366f1;
  background: #e0e7ff;
  border-radius: 50%;
  padding: 0.45rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: 0 1px 6px 0 #6366f11a;
}
.footer-simple-social:hover {
  background: #6366f1;
  color: #fff;
  box-shadow: 0 2px 12px 0 #6366f13a;
}
.footer-simple-sub {
  text-align: center;
  color: #64748b;
  font-size: 1.04rem;
  padding: 1.1rem 0 0.7rem 0;
  background: transparent;
  font-weight: 500;
}
@media (max-width: 900px) {
  .footer-simple-main {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 1rem 1rem 1rem;
    font-size: 1.01rem;
  }
  .footer-simple-brand {
    justify-content: center;
  }
  .footer-simple-contact {
    justify-content: center;
  }
  .footer-simple-links {
    justify-content: center;
  }
}
@media (max-width: 600px) {
  .footer-simple-main {
    gap: 1.1rem;
    padding: 1.1rem 0.5rem 0.7rem 0.5rem;
    font-size: 0.98rem;
  }
  .footer-simple-link {
    font-size: 1rem;
    padding: 0.15rem 0.05rem;
  }
  .footer-simple-title {
    font-size: 1.1rem;
  }
  .footer-simple-logo {
    font-size: 1.5rem;
    width: 2.1rem;
    height: 2.1rem;
  }
}`}
            </style>
      </>

);

export default AppFooter;