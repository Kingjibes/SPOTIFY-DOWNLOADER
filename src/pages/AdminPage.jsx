import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import AdminPasswordPrompt from '@/components/admin/AdminPasswordPrompt';
import AdminUrlTable from '@/components/admin/AdminUrlTable';
import AdminEditUrlForm from '@/components/admin/AdminEditUrlForm';
import { Search } from 'lucide-react';

const AdminPage = () => {
  const { toast } = useToast();
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingUrl, setEditingUrl] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);

  const fetchUrls = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('shortened_urls')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUrls(data || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching URLs', description: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const checkAdminAccess = useCallback(() => {
    const storedPassword = localStorage.getItem('adminPassword');
    const isAdminSession = localStorage.getItem('isAdmin') === 'true';
    // Replace 'SUPER_SECRET_ADMIN_PASSWORD_123' with your actual password logic or env variable
    if (isAdminSession || storedPassword === 'SUPER_SECRET_ADMIN_PASSWORD_123') { 
      if (!isAdminSession) localStorage.setItem('isAdmin', 'true'); // Set if only password matched
      setShowPasswordPrompt(false);
      fetchUrls();
    } else {
      setShowPasswordPrompt(true);
    }
  }, [fetchUrls]);
  
  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  const handlePasswordSuccess = () => {
    localStorage.setItem('isAdmin', 'true');
    // Optionally store a more secure token or session indicator if enhancing auth
    setShowPasswordPrompt(false);
    fetchUrls();
    toast({ title: 'Access Granted', description: 'Welcome, Admin!' });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminPassword'); // Or your more secure token
    setShowPasswordPrompt(true);
    setUrls([]); // Clear data on logout
    setEditingUrl(null);
    toast({title: "Logged Out", description: "You have been logged out of the admin panel."});
  };

  const handleDelete = async (id, short_code) => {
    if (!window.confirm(`Are you sure you want to delete the link for "${short_code}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const { error } = await supabase.from('shortened_urls').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'URL Deleted', description: `Link ${short_code} has been removed.` });
      fetchUrls();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting URL', description: error.message });
    }
  };
  
  const handleEdit = (url) => {
    setEditingUrl({...url});
  };

  const handleUpdateSuccess = () => {
    setEditingUrl(null);
    fetchUrls();
  };

  const filteredUrls = urls.filter(url => 
    url.short_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.original_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.custom_slug?.toLowerCase().includes(searchTerm.toLowerCase()) || // Though custom_slug is now null
    url.full_short_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  
  if (showPasswordPrompt) {
    return <AdminPasswordPrompt onSuccess={handlePasswordSuccess} />;
  }

  return (
    <motion.div 
      className="container mx-auto py-8 px-4 space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-extrabold gradient-text">Admin Panel - Manage URLs</h1>
        <div className="relative w-full md:w-1/3">
          <Input 
            type="text"
            placeholder="Search URLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 p-3 bg-slate-800/60 border-purple-500/50 focus:ring-purple-500 focus:border-purple-500 text-gray-100"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
        </div>
      </motion.div>

      {editingUrl && (
        <motion.div variants={itemVariants}>
          <AdminEditUrlForm 
            url={editingUrl} 
            onCancel={() => setEditingUrl(null)}
            onSuccess={handleUpdateSuccess}
          />
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="overflow-x-auto glassmorphic rounded-lg shadow-lg">
        <AdminUrlTable 
          urls={filteredUrls} 
          isLoading={isLoading} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
          Logout Admin
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AdminPage;