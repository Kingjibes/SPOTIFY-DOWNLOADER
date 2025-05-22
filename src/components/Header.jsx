import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        hamburgerButtonRef.current && 
        !hamburgerButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const navLinkClasses = ({ isActive }) =>
    `block py-2 px-3 rounded md:p-0 transition-colors duration-300 ${
      isActive
        ? 'text-spotify-green font-semibold'
        : 'text-spotify-light-gray hover:text-spotify-green'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `block py-3 px-4 text-lg border-b border-spotify-gray ${
      isActive
        ? 'text-spotify-green bg-spotify-black/50 font-semibold'
        : 'text-spotify-light-gray hover:bg-spotify-gray/70 hover:text-spotify-green'
    }`;
  
  const menuVariants = {
    open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { opacity: 0, x: "-100%", transition: { type: 'spring', stiffness: 300, damping: 30, when: "afterChildren" } },
  };

  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-spotify-black/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-spotify-gray/50"
    >
      <div className="text-center py-1 text-xs bg-spotify-green/80 text-spotify-black font-semibold">
        Made by HACKERPRO
      </div>
      <nav className="container mx-auto px-4 lg:px-6 py-3.5">
        <div className="flex flex-wrap justify-between items-center">
          <Link to="/" className="flex items-center">
            <Music2 className="h-8 w-8 mr-2 text-spotify-green" />
            <span className="self-center text-3xl font-extrabold whitespace-nowrap text-spotify-green">
              SpotifyDL
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            <Button
              ref={hamburgerButtonRef} 
              id="hamburger-button"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="lg:hidden text-spotify-light-gray hover:text-spotify-green focus:ring-2 focus:ring-spotify-green"
              aria-label="Open main menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </Button>
          </div>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="desktop-menu" 
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {navItems.map(item => (
                 <li key={item.to}>
                  <NavLink to={item.to} className={navLinkClasses} end={item.end}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            key="mobile-menu-content" // Ensure key is stable for AnimatePresence
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`lg:hidden fixed inset-0 bg-spotify-black/95 backdrop-blur-sm z-40 pt-[calc(theme(spacing.1)+theme(spacing.px)+theme(spacing.3_5)+theme(spacing.px)+theme(spacing.1))] overflow-y-auto shadow-2xl`} // Adjusted pt to match header height
          >
            <ul className="flex flex-col font-medium p-4">
              {navItems.map((item, index) => ( // Added index for staggered animation delay
                <motion.li 
                  key={`mobile-${item.to}`}
                  initial={{ opacity:0, x: -50 }}
                  animate={{ opacity:1, x: 0, transition:{delay: (index * 0.05) + 0.1} }}
                  exit={{ opacity:0, x: -50, transition:{delay: (index * 0.03)} }}
                >
                  <NavLink 
                    to={item.to} 
                    className={mobileNavLinkClasses} 
                    onClick={() => setIsMenuOpen(false)} 
                    end={item.end}
                  >
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;