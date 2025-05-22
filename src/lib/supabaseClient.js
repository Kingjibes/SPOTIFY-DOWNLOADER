import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yqhearzneqnrxxhvzyke.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaGVhcnpuZXFucnh4aHZ6eWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDMzNzYsImV4cCI6MjA2MzUxOTM3Nn0.7A35ZkjwF7SGc2hKyCd8vq77tnYB9odE_Z6RsJ8Tujc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);