import React, { useState, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link as LinkIcon, ArrowDownCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import SpotifyUrlForm from '@/components/homepage/SpotifyUrlForm';
import SongDisplay from '@/components/homepage/SongDisplay';
import LoadingIndicator from '@/components/homepage/LoadingIndicator';
import ErrorMessage from '@/components/homepage/ErrorMessage';
import DownloadHistorySection from '@/components/homepage/DownloadHistorySection';
import AppDownloadSection from '@/components/homepage/AppDownloadSection';

import { useSpotifyDownloader } from '@/hooks/useSpotifyDownloader';
import { useDownloadHistory } from '@/hooks/useDownloadHistory';
import { useClipboardHandler } from '@/hooks/useClipboardHandler';

const HomePage = () => {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const { toast } = useToast();
  const appDownloadSectionRef = useRef(null);

  const { downloadHistory, updateDownloadHistory, clearDownloadHistory } = useDownloadHistory();
  const { songData, isLoading, error, fetchSongData, setError } = useSpotifyDownloader(updateDownloadHistory);
  const { handlePasteFromManualButton, checkClipboardOnFocus } = useClipboardHandler(spotifyUrl, setSpotifyUrl);
  
  const handleHistoryItemClick = useCallback((itemSpotifyUrl) => {
    setSpotifyUrl(itemSpotifyUrl);
    toast({
      title: 'URL loaded from history',
      description: 'Press "Fetch Song" to download this track again.',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!spotifyUrl.trim()) {
      setError('Please enter a Spotify URL');
      toast({
        variant: 'destructive',
        title: 'Input required',
        description: 'Please paste a Spotify track URL',
      });
      return;
    }

    try {
      await fetchSongData(spotifyUrl);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: err.message || 'Could not fetch song data',
      });
    }
  };

  const scrollToAppDownload = () => {
    appDownloadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 flex flex-col items-center min-h-[calc(100vh-160px)]" 
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
    >
      <motion.div variants={itemVariants} className="w-full max-w-2xl text-center mb-6">
        <button 
          onClick={scrollToAppDownload} 
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-spotify-green bg-spotify-gray/60 border border-spotify-green/30 rounded-full hover:bg-spotify-gray/80 transition-colors duration-200 cursor-pointer shadow-md"
        >
          <ArrowDownCircle className="w-5 h-5 mr-2 animate-bounce" />
          Scroll down to download our app if needed
        </button>
      </motion.div>

      <motion.section variants={itemVariants} className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          <span className="text-spotify-green">Spotify Song Downloader</span>
        </h1>
        <p className="text-xl text-spotify-light-gray max-w-2xl mx-auto">
          Paste any Spotify track URL below to download it as MP3
        </p>
      </motion.section>

      <motion.section variants={itemVariants} className="w-full max-w-2xl mb-12">
        <Card className="glassmorphic shadow-2xl border-spotify-green/30 bg-spotify-gray/70">
          <CardHeader>
            <CardTitle className="text-3xl text-center flex items-center justify-center text-spotify-green">
              <LinkIcon className="mr-3 h-8 w-8" /> Download Spotify Tracks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpotifyUrlForm
              spotifyUrl={spotifyUrl}
              setSpotifyUrl={setSpotifyUrl}
              handleSubmit={handleSubmit}
              handlePaste={handlePasteFromManualButton}
              isLoading={isLoading}
              handleFocus={checkClipboardOnFocus}
            />
          </CardContent>
        </Card>
      </motion.section>

      <AnimatePresence>
        {isLoading && <LoadingIndicator message="Fetching song data..." />}
      </AnimatePresence>
      
      <AnimatePresence>
        {error && (
          <ErrorMessage 
            error={error} 
            onRetry={() => spotifyUrl && fetchSongData(spotifyUrl)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {songData && (
          <SongDisplay 
            songData={songData} 
            onDownloadAgain={() => fetchSongData(spotifyUrl)}
          />
        )}
      </AnimatePresence>

      {downloadHistory.length > 0 && (
        <DownloadHistorySection 
          history={downloadHistory}
          onClear={clearDownloadHistory}
          onItemClick={handleHistoryItemClick}
        />
      )}
      
      <AppDownloadSection ref={appDownloadSectionRef} />
    </motion.div>
  );
};

export default HomePage;import React, { useState, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link as LinkIcon, ArrowDownCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import SpotifyUrlForm from '@/components/homepage/SpotifyUrlForm';
import SongDisplay from '@/components/homepage/SongDisplay';
import LoadingIndicator from '@/components/homepage/LoadingIndicator';
import ErrorMessage from '@/components/homepage/ErrorMessage';
import DownloadHistorySection from '@/components/homepage/DownloadHistorySection';
import AppDownloadSection from '@/components/homepage/AppDownloadSection';

import { useSpotifyDownloader } from '@/hooks/useSpotifyDownloader';
import { useDownloadHistory } from '@/hooks/useDownloadHistory';
import { useClipboardHandler } from '@/hooks/useClipboardHandler';

const HomePage = () => {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const { toast } = useToast();
  const appDownloadSectionRef = useRef(null);

  const { downloadHistory, updateDownloadHistory, clearDownloadHistory } = useDownloadHistory();
  const { songData, isLoading, error, fetchSongData, setError } = useSpotifyDownloader(updateDownloadHistory);
  const { handlePasteFromManualButton, checkClipboardOnFocus } = useClipboardHandler(spotifyUrl, setSpotifyUrl);
  
  const handleHistoryItemClick = useCallback((itemSpotifyUrl) => {
    setSpotifyUrl(itemSpotifyUrl);
    toast({
      title: 'URL loaded from history',
      description: 'Press "Fetch Song" to download this track again.',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!spotifyUrl.trim()) {
      setError('Please enter a Spotify URL');
      toast({
        variant: 'destructive',
        title: 'Input required',
        description: 'Please paste a Spotify track URL',
      });
      return;
    }

    try {
      await fetchSongData(spotifyUrl);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: err.message || 'Could not fetch song data',
      });
    }
  };

  const scrollToAppDownload = () => {
    appDownloadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 flex flex-col items-center min-h-[calc(100vh-160px)]" 
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
    >
      <motion.div variants={itemVariants} className="w-full max-w-2xl text-center mb-6">
        <button 
          onClick={scrollToAppDownload} 
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-spotify-green bg-spotify-gray/60 border border-spotify-green/30 rounded-full hover:bg-spotify-gray/80 transition-colors duration-200 cursor-pointer shadow-md"
        >
          <ArrowDownCircle className="w-5 h-5 mr-2 animate-bounce" />
          Scroll down to download our app if needed
        </button>
      </motion.div>

      <motion.section variants={itemVariants} className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          <span className="text-spotify-green">Spotify Song Downloader</span>
        </h1>
        <p className="text-xl text-spotify-light-gray max-w-2xl mx-auto">
          Paste any Spotify track URL below to download it as MP3
        </p>
