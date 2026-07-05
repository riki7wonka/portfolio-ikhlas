import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('portfolio_achievements').select('*').limit(1);
  
  if (error) {
    if (error.code === '42P01') { 
      console.log('✅ Connection to Supabase successful!');
      console.log('⚠️ But the tables do not exist yet. Please run the SQL schema in the Supabase SQL Editor.');
    } else {
      console.error('❌ Connection or query failed:', error);
    }
  } else {
    console.log('✅ Connection successful AND tables exist!');
    console.log('Data:', data);
  }
}

testConnection();
