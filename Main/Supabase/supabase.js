import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL or anon key is missing.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);