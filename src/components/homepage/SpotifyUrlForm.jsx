import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, ClipboardPaste, Download, Loader2, AlertCircle } from 'lucide-react';

const SpotifyUrlForm = ({ spotifyUrl, setSpotifyUrl, handleSubmit, handlePaste, isLoading, handleFocus }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="relative">
          <Input
            id="spotifyUrl"
            type="url"
            placeholder="https://open.spotify.com/track/your-song-id"
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
            onFocus={handleFocus} 
            className="text-lg p-4 pl-12 bg-spotify-black/80 border-spotify-green/50 focus:ring-spotify-green focus:border-spotify-green text-spotify-light-gray placeholder-spotify-light-gray/70"
          />
          <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-spotify-green" />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={handlePaste} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-spotify-green hover:text-spotify-green/80"
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste className="h-6 w-6" />
          </Button>
        </div>
        <div className="mt-3 p-3 bg-spotify-gray/50 border border-spotify-green/30 rounded-md text-sm text-spotify-light-gray/90 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-spotify-green flex-shrink-0" />
          <span>
            <strong>Important:</strong> Please paste the direct link to a <strong>single song</strong> (e.g., from Spotify's "Share" &gt; "Copy Song Link"). Links from albums or playlists may not work correctly.
          </span>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full text-lg py-6 bg-spotify-green hover:bg-spotify-green/90 text-spotify-black font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover-glow disabled:opacity-70"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        ) : (
          <Download className="mr-2 h-6 w-6" />
        )}
        Fetch Song
      </Button>
    </form>
  );
};

export default SpotifyUrlForm;