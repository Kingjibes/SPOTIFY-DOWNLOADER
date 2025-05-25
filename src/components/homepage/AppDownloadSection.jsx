import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Smartphone, Music, FileText, Info } from 'lucide-react';

const APP_DOWNLOAD_URL = 'https://www.mediafire.com/file/c258ri21spt535j/Spotify+downloader.apk/file';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const AppDownloadSection = React.forwardRef((props, ref) => {
  return (
    <motion.section 
      ref={ref}
      variants={itemVariants} 
      className="w-full max-w-3xl mt-12 mb-8 p-6 glassmorphic rounded-xl shadow-2xl border-spotify-green/30 bg-spotify-gray/70 scroll-mt-20"
    >
      <h2 className="text-3xl font-bold text-spotify-green mb-6 text-center">
        How to Use & Download Our App
      </h2>
      <div className="space-y-4 text-spotify-light-gray/90 text-left">
        <div className="flex items-start">
          <Music className="h-6 w-6 mr-3 mt-1 text-spotify-green flex-shrink-0" />
          <p><strong>Playing Downloaded Music:</strong> After downloading, check your device's default music player. The song should appear there automatically.</p>
        </div>
        <div className="flex items-start">
          <FileText className="h-6 w-6 mr-3 mt-1 text-spotify-green flex-shrink-0" />
          <p><strong>If Not Found:</strong> Navigate to your device's file manager. Look for a folder named "Spotify Downloader" (or your browser's default download folder). Your music file will be there.</p>
        </div>
        <div className="flex items-start">
          <Info className="h-6 w-6 mr-3 mt-1 text-spotify-green flex-shrink-0" />
          <p><strong>File Extension:</strong> If the file has a <code>.bin</code> extension, simply rename it to <code>.mp3</code>. This will allow your music player to recognize and play it.</p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Button
          asChild
          className="text-lg py-4 px-8 bg-spotify-green hover:bg-spotify-green/90 text-spotify-black font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover-glow"
        >
          <a href={APP_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
            <Smartphone className="mr-3 h-6 w-6" /> Download Android App (.apk)
          </a>
        </Button>
        <p className="text-xs text-spotify-light-gray/70 mt-3">
          (Note: You may need to enable "Install from Unknown Sources" in your Android settings.)
        </p>
      </div>
    </motion.section>
  );
});

export default AppDownloadSection;
                                                                                                                                                                  
