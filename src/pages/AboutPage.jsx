import React from 'react';
import { motion } from 'framer-motion';
import { Info, User, Code } from 'lucide-react';

const AboutPage = () => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto py-12 px-4 space-y-10"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <motion.section variants={itemVariants}>
        <div className="flex items-center mb-6">
          <Info className="w-12 h-12 text-purple-400 mr-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text">
            About CIPHERTECH URL Shortener
          </h1>
        </div>
        <div className="glassmorphic p-8 rounded-xl shadow-2xl space-y-4 text-lg text-gray-300">
          <p>
            Welcome to CIPHERTECH URL Shortener! Our mission is to provide a simple, fast, and reliable way to transform long, cumbersome web addresses into short, manageable, and shareable links.
          </p>
          <p>
            Whether you're sharing links on social media, in emails, or any other platform, our service helps you make your URLs more appealing and easier to remember. We focus on a clean user experience and robust performance.
          </p>
          <p>
            Key features include custom slug generation, click tracking analytics, and a commitment to a user-friendly interface. We're constantly working to improve and add new functionalities to make your link-sharing experience even better.
          </p>
        </div>
      </motion.section>

      <motion.section variants={itemVariants}>
        <div className="flex items-center mb-6">
          <User className="w-12 h-12 text-purple-400 mr-4" />
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            Meet the Creator
          </h2>
        </div>
        <div className="glassmorphic p-8 rounded-xl shadow-2xl space-y-4 text-lg text-gray-300">
          <p>
            CIPHERTECH URL Shortener is proudly developed by <strong className="text-purple-300">HACKERPRO</strong>.
          </p>
          <p>
            HACKERPRO is a passionate software developer with a keen interest in creating practical and innovative web solutions. With a focus on modern web technologies and user-centric design, HACKERPRO aims to build tools that are not only functional but also enjoyable to use.
          </p>
          <div className="flex items-center text-purple-300 mt-4">
            <Code className="w-6 h-6 mr-2" />
            <span>Driven by code, inspired by challenges.</span>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AboutPage;