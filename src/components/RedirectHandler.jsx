import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const RedirectHandler = () => {
  const { shortCode: rawShortCode } = useParams(); // rawShortCode could be "pdiruo.cipher.com"
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      if (!rawShortCode) {
        setStatus('error');
        setErrorMessage('No short code provided in the URL.');
        return;
      }

      // The shortCodeFromPath for the Edge Function should be the rawShortCode itself.
      // The Edge Function `redirect-url` is designed to handle stripping `.cipher.com` if present.
      const shortCodeForFunction = rawShortCode;

      try {
        setStatus('loading');
        const { data, error: functionError } = await supabase.functions.invoke('redirect-url', {
          // The Edge Function expects the shortCode (e.g., "pdiruo.cipher.com") in the body
          body: JSON.stringify({ shortCodeFromPath: shortCodeForFunction }), 
        });
        
        if (functionError) {
          console.error("Supabase function invocation error details:", functionError);
          // Attempt to parse a more specific error from the function if available
          let detailedError = 'Function invocation failed.';
          if (functionError.context && functionError.context.details) {
            detailedError = functionError.context.details;
          } else if (typeof functionError.message === 'string' && functionError.message.includes('{')) {
            try {
              const parsedMessage = JSON.parse(functionError.message.substring(functionError.message.indexOf('{')));
              if(parsedMessage.error) detailedError = parsedMessage.error;
            } catch(e) { /* ignore parsing error, stick with default */ }
          } else if (functionError.message) {
            detailedError = functionError.message;
          }
          throw new Error(detailedError);
        }

        if (data && data.error) { // Error returned from within the Edge Function's logic
          setStatus('error');
          setErrorMessage(data.error || 'Failed to retrieve original URL.');
        } else if (data && data.originalUrl) {
          setOriginalUrl(data.originalUrl);
          setStatus('success');
          // Perform the redirect
          window.location.href = data.originalUrl;
        } else {
          setStatus('error');
          setErrorMessage('Original URL not found or invalid response from server.');
        }
      } catch (error) {
        console.error('Error fetching original URL:', error);
        setStatus('error');
        setErrorMessage(error.message || 'An unexpected error occurred during redirection.');
      }
    };

    fetchOriginalUrl();
  }, [rawShortCode, navigate]); // Dependency on rawShortCode

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Loader2 className="h-16 w-16 text-purple-400 animate-spin mb-6" />
          <p className="text-2xl font-semibold text-gray-200">Redirecting...</p>
          <p className="text-gray-400">Please wait while we fetch the original URL for "{rawShortCode}".</p>
        </motion.div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-800 to-slate-900 text-gray-100 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center glassmorphic p-8 md:p-12 rounded-xl shadow-2xl max-w-md w-full"
        >
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-red-300 mb-3">Redirection Failed</h1>
          <p className="text-gray-300 mb-2">Could not redirect for: <strong className="text-red-200 break-all">{rawShortCode}</strong></p>
          <p className="text-gray-300 mb-6">Error: {errorMessage}</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
          >
            Go to Homepage
          </Button>
        </motion.div>
      </div>
    );
  }
  
  if (status === 'success') {
     return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center glassmorphic p-8 md:p-12 rounded-xl shadow-2xl max-w-lg w-full"
        >
          <ExternalLink className="h-16 w-16 text-green-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-green-300 mb-3">Redirecting you now!</h1>
          <p className="text-gray-300 mb-4">
            For: <strong className="text-purple-300 break-all">{rawShortCode}</strong>
          </p>
          <p className="text-gray-300 mb-4">
            If you are not redirected automatically, please click the link below:
          </p>
          <a 
            href={originalUrl} 
            className="text-purple-400 hover:text-purple-300 underline break-all text-lg"
          >
            {originalUrl}
          </a>
           <p className="text-gray-500 text-sm mt-6">You are being redirected to the destination URL.</p>
        </motion.div>
      </div>
    );
  }

  return null; 
};

export default RedirectHandler;