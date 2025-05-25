import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle } from 'lucide-react';

const API_BASE_URL = 'https://apis.davidcyriltech.my.id/spotifydl?url=';

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
        const textResponse = await response.text();
        try {
            responseData = JSON.parse(textResponse);
        } catch (jsonError) {
            console.error("API returned non-JSON:", response.status, textResponse);
            throw new Error(`The API returned an unexpected response (Status: ${response.status}). This could be a temporary issue with the service. Raw response: ${textResponse.substring(0,100)}...`);
        }
      } catch (textError) {
        console.error("Failed to get text from API response:", textError);
        throw new Error(`Failed to read response from the API (Status: ${response.status}). Please try again later.`);
      }


      if (!response.ok) {
        let apiMessage = responseData?.message || `Failed to fetch song data. API Status: ${response.status}`;
        if (response.status === 404) {
          apiMessage = "The song could not be found by the download service. Please check the link or try a different song.";
        } else if (response.status >= 500) {
          apiMessage = "The download service is currently experiencing issues. Please try again later.";
        }
        throw new Error(apiMessage);
      }
      
      if (responseData.success && responseData.title && responseData.DownloadLink) {
        setSongData(responseData);
        if (updateDownloadHistoryCallback) {
          updateDownloadHistoryCallback(responseData, urlToFetch);
        }
        toast({ 
          title: 'Song Found!', 
          description: responseData.title,
          action: <CheckCircle className="text-spotify-green" />
        });
      } else {
        // This case handles when API returns success:false or missing crucial data
        let detailedError = "Could not retrieve song information from the service.";
        if (responseData.message) {
            detailedError = `Service error: ${responseData.message}`;
        } else if (response.status === 200 && !responseData.DownloadLink) {
            detailedError = "The service found the song but could not provide a download link. This song might not be downloadable.";
        }
        throw new Error(detailedError);
      }
    } catch (err) {
      console.error("API Error:", err);
      let errorMessage = err.message || 'An unexpected error occurred while fetching song data.';
      // Consolidate common error checks here
      if (errorMessage.toLowerCase().includes("not found")) {
        errorMessage = "Song not found by the service or link is invalid. Please double-check the Spotify URL.";
      } else if (errorMessage.includes("Status: 5") || errorMessage.toLowerCase().includes("service is temporarily unavailable")) { 
        errorMessage = "The download service is temporarily unavailable or experiencing issues. Please try again later.";
      } else if (errorMessage.toLowerCase().includes("unexpected response") || errorMessage.toLowerCase().includes("failed to read response")) {
        // Keep the detailed message from the try/catch around response.json()
      }
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'Fetch Error', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [toast, updateDownloadHistoryCallback]);

  return { songData, isLoading, error, fetchSongData, setError, setIsLoading, setSongData };
};
