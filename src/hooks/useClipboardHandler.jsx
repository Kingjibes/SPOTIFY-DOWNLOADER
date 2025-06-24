import { isValidSpotifyTrackUrl } from './useSpotifyDownloader';

export const useClipboardHandler = (spotifyUrl, setSpotifyUrl) => {
  const handlePasteFromManualButton = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (isValidSpotifyTrackUrl(text)) {
        setSpotifyUrl(text);
      } else {
        throw new Error('Clipboard does not contain a valid Spotify track URL');
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      throw err;
    }
  };

  const checkClipboardOnFocus = async () => {
    if (spotifyUrl.trim()) return;
    
    try {
      const text = await navigator.clipboard.readText();
      if (isValidSpotifyTrackUrl(text)) {
        setSpotifyUrl(text);
      }
    } catch (err) {
      console.error('Clipboard access error:', err);
    }
  };

  return { handlePasteFromManualButton, checkClipboardOnFocus };
};
