import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingIndicator = () => {
  return (
    <motion.div
      key="loading-indicator"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-8 text-center"
    >
      <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto" />
      <p className="text-lg text-gray-300 mt-2">Fetching song details...</p>
    </motion.div>
  );
};

export default LoadingIndicator;