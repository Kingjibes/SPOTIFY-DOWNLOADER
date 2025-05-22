import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const AdminPasswordPrompt = ({ onSuccess }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const { toast } = useToast();

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // IMPORTANT: Replace 'SUPER_SECRET_ADMIN_PASSWORD_123' with your actual secure password.
    // Consider using an environment variable for this in a real application,
    // though client-side password checks are inherently insecure.
    // This is a basic gate, not true authentication.
    if (adminPassword === 'SUPER_SECRET_ADMIN_PASSWORD_123') {
      localStorage.setItem('adminPassword', adminPassword); // Demo purpose, insecure
      onSuccess();
    } else {
      toast({ variant: 'destructive', title: 'Access Denied', description: 'Incorrect password.' });
    }
    setAdminPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="glassmorphic shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center gradient-text flex items-center justify-center">
              <ShieldCheck className="mr-3 h-8 w-8" /> Admin Access
            </CardTitle>
            <CardDescription className="text-center text-gray-400 pt-1">
              Please enter the password to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-purple-300 mb-1">
                  Password
                </label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="text-lg p-3 bg-slate-800/60 border-purple-500/50 focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full text-lg py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg"
              >
                Unlock Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPasswordPrompt;