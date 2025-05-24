import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; 
import { useToast } from '@/components/ui/use-toast';
import { Send, Mail, User, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, message }]);

      if (error) {
        throw error;
      }

      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out! We'll get back to you soon.",
      });
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: error.message || "Could not send your message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto py-12 px-4"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="text-center mb-10">
        <Mail className="w-16 h-16 text-spotify-green mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-spotify-green">
          Contact Us
        </h1>
        <p className="text-lg text-spotify-light-gray mt-3">
          Have questions or feedback about the Spotify Downloader? Let us know!
        </p>
      </div>

      <div className="glassmorphic p-8 rounded-xl shadow-2xl border-spotify-green/30 bg-spotify-gray/70">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-spotify-green/80 mb-1">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-spotify-green pointer-events-none" />
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-3 text-lg py-3 bg-spotify-black/80 border-spotify-green/50 focus:ring-spotify-green focus:border-spotify-green text-spotify-light-gray placeholder-spotify-light-gray/70"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-spotify-green/80 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-spotify-green pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 text-lg py-3 bg-spotify-black/80 border-spotify-green/50 focus:ring-spotify-green focus:border-spotify-green text-spotify-light-gray placeholder-spotify-light-gray/70"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-spotify-green/80 mb-1">
              Message
            </label>
            <div className="relative flex items-start">
               <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-spotify-green pointer-events-none" />
              <Textarea
                id="message"
                placeholder="Your feedback or question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full pl-10 pr-3 text-lg py-3 bg-spotify-black/80 border-spotify-green/50 focus:ring-spotify-green focus:border-spotify-green text-spotify-light-gray placeholder-spotify-light-gray/70"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-4 bg-spotify-green hover:bg-spotify-green/90 text-spotify-black font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover-glow disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <Send className="mr-2 h-5 w-5" />
            )}
            Send Message
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactPage;
