import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import React from "react";
import "./footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* About Section */}
                <div className="footer-section about">
                    <h4>About Us</h4>
                    <p>
                        Our platform connects people across the globe to share ideas, content,
                        and creativity. Join us in building the future of social networking.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                        <li><a href="#help">Help & Support</a></li>
                    </ul>
                </div>

                {/* Social Media Links */}
                <div className="footer-section social">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <FacebookIcon style={{color:"green"}}/>
                        <TwitterIcon style={{color:"orange"}}/>
                        <InstagramIcon style={{color:"blue"}}/>
                        <LinkedInIcon style={{color:"yellow"}}/>
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="footer-section newsletter">
                    <h4>Subscribe to Our Newsletter</h4>
                    <form>
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} YourCompany. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
