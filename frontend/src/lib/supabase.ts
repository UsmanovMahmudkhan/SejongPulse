import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xgtfkrupjnpebsaqvoys.supabase.co';
const supabaseAnonKey = 'sb_publishable_NIorGH9la7NxVGIcvsVeEQ_JITgGdNI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
