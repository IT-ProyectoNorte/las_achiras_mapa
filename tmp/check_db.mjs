
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  const { data, error } = await supabase
    .from('Achiras')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching Achiras table:', error.message);
    const { data: lotesData, error: lotesError } = await supabase
      .from('lotes')
      .select('*')
      .limit(1);
    if (lotesError) {
       console.error('Error fetching lotes table:', lotesError.message);
    } else {
       console.log('Successfully connected to lotes table. Sample row:', lotesData[0]);
    }
  } else {
    console.log('Successfully connected to Achiras table. Sample row:', data[0]);
    if (data.length > 0) {
      console.log('Columns found:', Object.keys(data[0]));
    }
  }
}

checkTable();
