import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const SongDisplay = ({ songData }) => {
  if (!songData) return null;

  return (
    <motion.div
      key="song-data"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="mt-10 w-full max-w-2xl"
    >
      <Card className="glassmorphic shadow-2xl border-green-500/30">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-3xl gradient-text">
            {songData.title}
          </CardTitle>
          {songData.thumbnail && (
            <div className="mt-4 w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-lg border-2 border-purple-500/50">
              <img-replace src={songData.thumbnail} alt={songData.title} className="w-full h-full object-cover" />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <div className="flex items-center justify-center text-lg text-gray-300">
            <User className="mr-2 h-5 w-5 text-purple-400" /> Artist: {songData.channel || 'N/A'}
          </div>
          <div className="flex items-center justify-center text-lg text-gray-300">
            <Clock className="mr-2 h-5 w-5 text-purple-400" /> Duration: {songData.duration || 'N/A'}
          </div>
          <div className="pt-4">
            <Button
              asChild
              className="w-full md:w-auto text-lg py-6 px-10 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover-glow"
            >
              <a href={songData.DownloadLink} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-6 w-6" /> Download Song
              </a>
            </Button>
          </div>
           <p className="text-xs text-gray-500 pt-3">Clicking download will open the link in a new tab. Your browser will handle the download.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SongDisplay;