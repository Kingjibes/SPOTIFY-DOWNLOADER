import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, User, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SongDisplay = ({ songData }) => {
  const [downloadError, setDownloadError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!songData) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    
    try {
      if (!songData.downloadUrl) {
        throw new Error('No download link available');
      }

      // Create a temporary anchor tag to trigger download
      const link = document.createElement('a');
      link.href = songData.downloadUrl;
      link.download = `${songData.title.replace(/[^a-z0-9]/gi, '_')}.mp3`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Fallback if the download doesn't start
      setTimeout(() => {
        if (!document.body.contains(link)) {
          window.open(songData.downloadUrl, '_blank');
        }
      }, 1000);

    } catch (error) {
      setDownloadError(error.message);
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

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
          {songData.imageUrl && (
            <div className="mt-4 w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-lg border-2 border-purple-500/50">
              <img 
                src={songData.imageUrl} 
                alt={songData.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-song.jpg';
                }}
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <div className="flex items-center justify-center text-lg text-gray-300">
            <User className="mr-2 h-5 w-5 text-purple-400" /> 
            Artist: {songData.artist || 'Unknown Artist'}
          </div>
          <div className="flex items-center justify-center text-lg text-gray-300">
            <Clock className="mr-2 h-5 w-5 text-purple-400" /> 
            Type: {songData.type || 'track'}
          </div>
          
          <div className="pt-4">
            <Button
              onClick={handleDownload}
              disabled={isDownloading || !songData.downloadUrl}
              className="w-full md:w-auto text-lg py-6 px-10 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover-glow"
            >
              {isDownloading ? (
                'Downloading...'
              ) : (
                <>
                  <Download className="mr-2 h-6 w-6" /> 
                  Download MP3
                </>
              )}
            </Button>
          </div>

          {downloadError && (
            <div className="flex items-center justify-center text-red-400 mt-2">
              <AlertCircle className="mr-2 h-4 w-4" />
              {downloadError}
            </div>
          )}

          <p className="text-xs text-gray-500 pt-3">
            {songData.downloadUrl 
              ? "The download will start automatically or open in a new tab"
              : "Download link not available"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SongDisplay;
