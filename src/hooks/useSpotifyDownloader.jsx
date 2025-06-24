import { useState } from 'react';

// Enhanced URL validation function
export const isValidSpotifyTrackUrl = (url) => {
  const spotifyPattern = /^(https?:\/\/)?(www\.)?open\.spotify\.com\/track\/[a-zA-Z0-9]+(\?.*)?$/;
  const spotifyUriPattern = /^spotify:track:[a-zA-Z0-9]+$/;
  return spotifyPattern.test(url) || spotifyUriPattern.test(url);
};

export const useSpotifyDownloader = (updateDownloadHistory) => {
  const [songData, setSongData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const fetchSongData = async (spotifyUrl) => {
    setIsLoading(true);
    setError(null);
    setSongData(null);
    setDownloadProgress(0);

    try {
      // Normalize URL format
      let processedUrl = spotifyUrl.trim();
      if (processedUrl.startsWith('spotify:track:')) {
        processedUrl = `https://open.spotify.com/track/${processedUrl.split(':')[2]}`;
      }

      if (!isValidSpotifyTrackUrl(processedUrl)) {
        throw new Error('Invalid Spotify URL. Please use:\nhttps://open.spotify.com/track/...\nor\nspotify:track:...');
      }

      // Show progress
      setDownloadProgress(10);
      
      const apiUrl = `https://apis.davidcyriltech.my.id/spotifydl2?url=${encodeURIComponent(processedUrl)}`;
      const response = await fetch(apiUrl);
      setDownloadProgress(30);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setDownloadProgress(70);

      if (!data?.success) {
        throw new Error(data?.message || 'Invalid response from server');
      }

      if (!data.results?.downloadMP3) {
        throw new Error('No download link found in response');
      }

      // Process the download URL
      let downloadUrl = data.results.downloadMP3;
      if (!downloadUrl.startsWith('http')) {
        downloadUrl = downloadUrl.startsWith('//') ? `https:${downloadUrl}` : `https://${downloadUrl}`;
      }

      const formattedData = {
        title: data.results.title || 'Unknown Track',
        imageUrl: data.results.image || '/placeholder-song.jpg',
        downloadUrl: downloadUrl,
        type: data.results.type || 'track',
        artist: data.results.artist || 'Unknown Artist',
        duration: data.results.duration || '0:00', // Added duration field
        explicit: data.results.explicit || false // Added explicit flag
      };

      setDownloadProgress(90);
      setSongData(formattedData);
      updateDownloadHistory(processedUrl, formattedData.title);
      setDownloadProgress(100);
      
    } catch (err) {
      setError(err.message.includes('Failed to fetch') 
        ? 'Network error. Please check your connection.'
        : err.message);
      setDownloadProgress(0);
    } finally {
      setIsLoading(false);
      setTimeout(() => setDownloadProgress(0), 1000);
    }
  };

  return { 
    songData, 
    isLoading, 
    error, 
    downloadProgress,
    fetchSongData, 
    setError,
    isValidSpotifyTrackUrl // Also export the validation function
  };
};
