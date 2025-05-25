import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

const MAX_HISTORY_ITEMS = 10;
const LOCAL_STORAGE_KEY = 'spotifyDlHistory';

export const useDownloadHistory = () => {
  const [downloadHistory, setDownloadHistory] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    setDownloadHistory(storedHistory);
  }, []);

  const updateDownloadHistory = useCallback((newSongData, originalUrl) => {
    const newHistoryItem = {
      title: newSongData.title,
      artist: newSongData.channel || 'N/A',
      thumbnail: newSongData.thumbnail,
      spotifyUrl: originalUrl, 
      timestamp: new Date().toISOString(),
    };

    setDownloadHistory(prevHistory => {
      const updatedHistory = [newHistoryItem, ...prevHistory.filter(item => item.spotifyUrl !== originalUrl)].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

  const clearDownloadHistory = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setDownloadHistory([]);
    toast({ title: 'History Cleared', description: 'Your download history has been removed.', icon: <Trash2 className="text-spotify-green" /> });
  }, [toast]);

  return { downloadHistory, updateDownloadHistory, clearDownloadHistory };
};
                           
