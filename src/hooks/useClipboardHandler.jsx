import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle } from 'lucide-react';
import { isValidSpotifyTrackUrl } from '@/hooks/useSpotifyDownloader'; // Assuming it's moved

export const useClipboardHandler = (currentUrlValue, setUrlCallback) => {
  const { toast } = useToast();

  const handlePasteFromManualButton = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlCallback(text);
        toast({ 
          title: 'Pasted from clipboard!', 
          description: 'URL populated from clipboard.',
          action: <CheckCircle className="text-spotify-green" />
        });
      } else {
        toast({ variant: 'destructive', title: 'Clipboard Empty', description: 'Nothing to paste from clipboard.'});
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      toast({ variant: 'destructive', title: 'Paste Error', description: 'Could not read from clipboard. Check permissions.'});
    }
  };
  
  const checkClipboardOnFocus = useCallback(async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
        const text = await navigator.clipboard.readText();
        // Check if currentUrlValue is empty before suggesting paste
        if (text && isValidSpotifyTrackUrl(text) && currentUrlValue === '') { 
          toast({
            title: 'Spotify Link Detected!',
            description: (
              <div>
                <p className="mb-2">We found a Spotify link in your clipboard:</p>
                <p className="text-xs bg-spotify-gray p-2 rounded break-all mb-3">{text}</p>
                <p>Would you like to paste it into the input field?</p>
              </div>
            ),
            duration: 10000, 
            action: (
              <Button 
                variant="outline" 
                className="bg-spotify-green text-spotify-black hover:bg-spotify-green/90"
                onClick={() => {
                  setUrlCallback(text);
                  toast({ title: 'Pasted!', description: 'Link pasted from clipboard detection.', action: <CheckCircle className="text-spotify-green" /> });
                }}
              >
                Paste Link
              </Button>
            ),
            icon: <Info className="text-spotify-green" />
          });
        }
      }
    } catch (err) {
      // Silently fail on permission errors or if document doesn't have focus
      if (err.name !== 'NotAllowedError' && err.name !== 'SecurityError' && document.hasFocus()) {
         console.warn('Clipboard read on focus failed:', err.message);
      }
    }
  }, [currentUrlValue, setUrlCallback, toast]);


  useEffect(() => {
    if (document.hasFocus()) { // Initial check only if document has focus
        checkClipboardOnFocus();
    }
    window.addEventListener('focus', checkClipboardOnFocus);
    return () => {
      window.removeEventListener('focus', checkClipboardOnFocus);
    };
  }, [checkClipboardOnFocus]);

  return { handlePasteFromManualButton, checkClipboardOnFocus }; // checkClipboardOnFocus is mainly for onFocus event setup
};
      
