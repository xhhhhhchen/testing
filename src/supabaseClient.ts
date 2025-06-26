import { createClient } from '@supabase/supabase-js';
// supabaseClient.js

export const supabase = createClient(
    "https://ckxrbmmiajxayjukmbpz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNreHJibW1pYWp4YXlqdWttYnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NzU3MjYsImV4cCI6MjA2NjA1MTcyNn0.Zcr7qVBZYtIA2QHBCh7PFmDCz9XLUzbgbIlZPtoc2Xk",
 {
    auth: {
        persistSession: true, // ✅ crucial
        autoRefreshToken: true, // ✅ ensures sessions stay fresh
        detectSessionInUrl: true,
    },
 }
);

