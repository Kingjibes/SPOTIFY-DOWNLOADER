import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

const AdminEditUrlForm = ({ url, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({ original_url: '', short_code: '', custom_slug: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (url) {
      setFormData({
        original_url: url.original_url || '',
        short_code: url.short_code || '',
        custom_slug: url.custom_slug || '', // Though this is now null typically
        full_short_url: url.full_short_url || '' // For display consistency
      });
    }
  }, [url]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url || !url.id) return;
    setIsSubmitting(true);

    try {
      // Reconstruct full_short_url if short_code is changed
      const updatedFullShortUrl = `${formData.short_code}.cipher.com`;

      const { data, error } = await supabase
        .from('shortened_urls')
        .update({ 
          original_url: formData.original_url, 
          short_code: formData.short_code,
          custom_slug: formData.custom_slug, // Keep this in update if schema has it, even if usually null
          full_short_url: updatedFullShortUrl 
        })
        .eq('id', url.id)
        .select()
        .single();

      if (error) throw error;
      toast({ title: 'URL Updated', description: `Link ${data.short_code} has been updated.` });
      onSuccess();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error updating URL', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!url) return null;

  return (
    <Card className="my-6 glassmorphic">
      <CardHeader>
        <CardTitle className="gradient-text">Edit URL: {url.short_code}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="original_url" className="block text-sm font-medium text-purple-300 mb-1">Original URL</label>
            <Input id="original_url" type="url" value={formData.original_url} onChange={handleChange} required className="bg-slate-700/50 border-purple-500/50 text-gray-100"/>
          </div>
          <div>
            <label htmlFor="short_code" className="block text-sm font-medium text-purple-300 mb-1">Short Code (Actual for DB, e.g., abcdef)</label>
            <Input id="short_code" type="text" value={formData.short_code} onChange={handleChange} required className="bg-slate-700/50 border-purple-500/50 text-gray-100"/>
             <p className="text-xs text-gray-400 mt-1">Changing this will change the <code className="text-xs bg-slate-600 p-0.5 rounded">.cipher.com</code> link. Ensure uniqueness.</p>
          </div>
          {/* Custom slug is typically null now, but field kept if schema still supports it for direct DB edits */}
          {/* <div>
            <label htmlFor="custom_slug" className="block text-sm font-medium text-purple-300 mb-1">Custom Slug Part (Usually null)</label>
            <Input id="custom_slug" type="text" value={formData.custom_slug} onChange={handleChange} className="bg-slate-700/50 border-purple-500/50 text-gray-100"/>
          </div> */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null}
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="border-purple-500/70 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminEditUrlForm;