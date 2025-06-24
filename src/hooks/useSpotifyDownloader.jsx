import { useState } from 'react';

// Export the URL validation function
export const isValidSpotifyTrackUrl = (url) => {
  const spotifyPattern = /^(https?:\/\/)?(www\.)?open\.spotify\.com\/track\/[a-zA-Z0-9]+(\?.*)?$/;
  return spotifyPattern.test(url);
};

export const useSpotifyDownloader = (updateDownloadHistory) => {
  const [songData, setSongData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSongData = async (spotifyUrl) => {
    setIsLoading(true);
    setError(null);
    setSongData(null);

    try {
      if (!isValidSpotifyTrackUrl(spotifyUrl)) {
        throw new Error('Invalid Spotify URL. Please use format: https://open.spotify.com/track/...');
      }

      const response = await fetch(`https://apis.davidcyriltech.my.id/spotifydl2?url=${encodeURIComponent(spotifyUrl)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.results) {
        throw new Error(data.message || 'Failed to fetch song data');
      }

      const formattedData = {
        title: data.results.title,
        imageUrl: data.results.image,
        downloadUrl: data.results.downloadMP3,
        type: data.results.type,
        artist: data.results.artist || 'Unknown Artist'
      };

      setSongData(formattedData);
      updateDownloadHistory(spotifyUrl, formattedData.title);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return { songData, isLoading, error, fetchSongData, setError };
};
