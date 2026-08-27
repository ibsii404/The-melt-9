import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import melt9Logo from '../../assets/images/melt-9-logo.jpeg';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/track-order', label: 'Track Order' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center shrink-0">
            <img src={melt9Logo} alt="The Melt 9" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8 px-4">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-melt-red transition font-medium">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/cart" className="relative p-1 rounded hover:bg-gray-100 transition">
              <ShoppingCartIcon className="h-6 w-6 text-melt-charcoal hover:text-melt-red" />
              <span className="absolute -top-2 -right-2 bg-melt-red text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => {
                      setProfileMenuOpen((prev) => !prev);
                    }}
                    className="p-1 rounded hover:bg-gray-100 transition"
                    aria-label="Profile menu"
                  >
                    <UserIcon className="h-6 w-6 text-melt-charcoal" />
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <p className="px-4 py-2 text-sm text-melt-charcoal truncate">{user.email || 'Signed in'}</p>
                      <div className="hidden md:block border-t my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="hidden md:block w-full text-left px-4 py-2 text-sm text-melt-red hover:bg-melt-cream"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-secondary text-sm py-2 px-5 sm:px-6">
                Login
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-1 rounded hover:bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-melt-cream border-b last:border-b-0"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-melt-red hover:bg-melt-cream"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-melt-cream"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
