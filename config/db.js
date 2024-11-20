const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://fwckeyhnbdcdphaayjlx.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Y2tleWhuYmRjZHBoYWF5amx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NzU4NDUsImV4cCI6MjA0NzQ1MTg0NX0.70Dtf0wEZV8y3pnPw-jdw9O17BV--OEAE5tIYCC5nEA'; // Анонимный ключ (anon key)

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
