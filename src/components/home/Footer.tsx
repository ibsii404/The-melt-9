import { Link } from 'react-router-dom';
import { 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon, 
  YoutubeIcon 
} from 'react-icons/fa';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-melt-charcoal text-white">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-heading font-extrabold text-melt-gold mb-4">
              THE MELT 9
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Where cheese melts perfectly! Serving the finest pizza and steak in Multan since 2020.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gray-700 p-2 rounded-full hover:bg-melt-gold hover:text-melt-charcoal transition"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-700 p-2 rounded-full hover:bg-melt-gold hover:text-melt-charcoal transition"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-700 p-2 rounded-full hover:bg-melt-gold hover:text-melt-charcoal transition"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-700 p-2 rounded-full hover:bg-melt-gold hover:text-melt-charcoal transition"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-melt-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-melt-gold transition">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-melt-gold transition">Menu</Link>
              </li>
              <li>
                <Link to="/menu?category=Deals" className="text-gray-300 hover:text-melt-gold transition">Deals</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-melt-gold transition">Blog</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-melt-gold transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-melt-gold transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-melt-gold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-melt-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Main Boulevard, Gulgasht Colony, Multan
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-melt-gold flex-shrink-0" />
                <span className="text-gray-300">+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-melt-gold flex-shrink-0" />
                <span className="text-gray-300">info@themelt9.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-melt-gold flex-shrink-0" />
                <span className="text-gray-300">11:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-melt-gold mb-4">Newsletter</h4>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to get updates on new deals and offers!
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-melt-gold"
              />
              <button
                type="submit"
                className="w-full bg-melt-gold text-melt-charcoal font-semibold py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} THE MELT 9 Pizza & Steak House. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link to="/privacy" className="hover:text-melt-gold transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-melt-gold transition">Terms of Service</Link>
              <Link to="/sitemap" className="hover:text-melt-gold transition">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
