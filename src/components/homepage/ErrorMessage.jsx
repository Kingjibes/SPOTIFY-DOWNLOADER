import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <motion.div
      key="error-message"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-8 w-full max-w-2xl"
    >
      <Card className="bg-red-900/30 border-red-500/50 text-red-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-red-300">
            <AlertTriangle className="mr-2 h-6 w-6" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ErrorMessage;