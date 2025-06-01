import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle } from 'lucide-react';

const API_BASE_URL = 'https://api-aswin-sparky.koyeb.app/api/downloader/spotify?url=';

const cleanSpotifyUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;
  } catch (e) {
    return url; 
  }
};

export const isValidSpotifyTrackUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const cleanedForValidation = cleanSpotifyUrl(url);
    const parsedUrl = new URL(cleanedForValidation);
    const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment.length > 0);
    
    const isValidHostname = parsedUrl.hostname === 'open.spotify.com' || parsedUrl.hostname === 'spotify.com';
    if (!isValidHostname) return false;

    const trackIndex = pathSegments.findIndex(segment => segment === 'track');
    
    return trackIndex !== -1 && pathSegments.length > trackIndex + 1 && pathSegments[trackIndex+1].length > 0;
  } catch (e) {
    return false;
  }
};

export const useSpotifyDownloader = (updateDownloadHistoryCallback) => {
  const [songData, setSongData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchSongData = useCallback(async (urlToFetch) => {
    if (!isValidSpotifyTrackUrl(urlToFetch)) {
      setError('Please enter a valid Spotify song URL. It should point directly to a track (e.g., https://open.spotify.com/track/...). Album or playlist links are not supported.');
      toast({ variant: 'destructive', title: 'Invalid URL Format', description: 'Ensure you are using a direct Spotify song track URL.' });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSongData(null);

    const cleanedUrl = cleanSpotifyUrl(urlToFetch);

    try {
      const response = await fetch(`${API_BASE_URL}${encodeURIComponent(cleanedUrl)}`);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error("API returned non-JSON:", response.status, response);
        throw new Error(`The API returned an unexpected response (Status: ${response.status}).`);
      }

      if (!response.ok || !responseData.status) {
        let apiMessage = responseData?.message || `Failed to fetch song data. API Status: ${response.status}`;
        if (response.status === 404) {
          apiMessage = "The song could not be found by the download service. Please check the link or try a different song.";
        } else if (response.status >= 500) {
          apiMessage = "The download service is currently experiencing issues. Please try again later.";
        }
        throw new Error(apiMessage);
      }
      
      if (responseData.status && responseData.data) {
        const formattedData = {
          success: true,
          title: responseData.data.title,
          artist: responseData.data.artis, // Note: Typo in API response ("artis" instead of "artist")
          duration: responseData.data.durasi,
          image: responseData.data.image,
          downloadLink: responseData.data.download,
          type: responseData.data.type,
          status: responseData.data.status
        };
        
        setSongData(formattedData);
        if (updateDownloadHistoryCallback) {
          updateDownloadHistoryCallback(formattedData, urlToFetch);
        }
        toast({ 
          title: 'Song Found!', 
          description: `${formattedData.title} by ${formattedData.artist}`,
          action: <CheckCircle className="text-spotify-green" />
        });
      } else {
        throw new Error(responseData.message || "Could not retrieve song information from the service.");
      }
    } catch (err) {
      console.error("API Error:", err);
      let errorMessage = err.message || 'An unexpected error occurred while fetching song data.';
      if (errorMessage.toLowerCase().includes("not found")) {
        errorMessage = "Song not found by the service or link is invalid. Please double-check the Spotify URL.";
      } else if (errorMessage.includes("Status: 5") || errorMessage.toLowerCase().includes("service is temporarily unavailable")) { 
        errorMessage = "The download service is temporarily unavailable or experiencing issues. Please try again later.";
      }
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'Fetch Error', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [toast, updateDownloadHistoryCallback]);

  return { songData, isLoading, error, fetchSongData, setError, setIsLoading, setSongData };
};
