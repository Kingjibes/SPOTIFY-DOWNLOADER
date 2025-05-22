import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink, Loader2 } from 'lucide-react';

const AdminUrlTable = ({ urls, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
        <p className="ml-4 text-xl text-gray-300">Loading URLs...</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-slate-700">
          <TableHead className="text-purple-300">Short URL (Display)</TableHead>
          <TableHead className="text-purple-300">Short Code (Actual)</TableHead>
          <TableHead className="text-purple-300 max-w-xs truncate">Original URL</TableHead>
          <TableHead className="text-purple-300 text-center">Clicks</TableHead>
          <TableHead className="text-purple-300">Created At</TableHead>
          <TableHead className="text-purple-300 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {urls.length > 0 ? urls.map((url) => {
          const clickableShortUrl = `${window.location.origin}/s/${url.full_short_url}`;
          return (
          <TableRow key={url.id} className="border-slate-700 hover:bg-slate-800/50">
            <TableCell>
              <a href={clickableShortUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 hover:underline flex items-center gap-1">
                {url.full_short_url} <ExternalLink size={14} />
              </a>
            </TableCell>
             <TableCell className="font-medium text-gray-300">{url.short_code}</TableCell>
            <TableCell className="max-w-xs truncate text-gray-400" title={url.original_url}>{url.original_url}</TableCell>
            <TableCell className="text-center text-purple-300">{url.click_count === null ? 0 : url.click_count}</TableCell>
            <TableCell className="text-gray-500">{new Date(url.created_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(url)} className="hover:text-blue-400 text-gray-400">
                <Edit size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(url.id, url.short_code)} className="hover:text-red-500 text-gray-400">
                <Trash2 size={18} />
              </Button>
            </TableCell>
          </TableRow>
        )}) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500 py-8">No URLs found matching your search or no URLs created yet.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default AdminUrlTable;