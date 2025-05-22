
import React from 'react';
import { Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-black/30 border-t border-slate-700/50 text-gray-400 py-8"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center mb-3">
          <Music2 className="h-6 w-6 mr-2 text-purple-400" />
          <span className="text-xl font-bold text-gray-100">SpotifyDL</span>
        </div>
        <p className="text-sm mb-2">
          Download your favorite Spotify songs quickly and easily.
        </p>
        <p className="text-sm mb-3">
          <Link to="/contact" className="hover:text-purple-300 transition-colors">Contact Us</Link>
        </p>
        <div className="text-xs">
          <p>&copy; {currentYear} SpotifyDL by HACKERPRO. All Rights Reserved.</p>
          <p className="mt-1">This service is for personal use only. Respect copyright laws.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;