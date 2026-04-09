
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kyxmpbvgzewxhitnivnx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5eG1wYnZnemV3eGhpdG5pdm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTE2MTQsImV4cCI6MjA5MDA2NzYxNH0.vWgEzubR4UT-BVvBidTkQM-9M41li2j01qNIOcWfgSs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('--- DIAGNOSTICO DE BASE DE DATOS ---');
  console.log('Intentando conectar con la tabla "Achiras"...');

  try {
    const { data, error, count } = await supabase
      .from('Achiras')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('❌ ERROR AL CONECTAR:', error.message);
      console.error('Detalles del error:', error);
    } else {
      console.log('✅ CONEXIÓN EXITOSA.');
      console.log('FILAS RECUPERADAS:', data ? data.length : 0);
      console.log('CONTEO EXACTO:', count);

      if (data && data.length > 0) {
        console.log('MUESTRA DE DATOS (Fila 1):', data[0]);
        console.log('COLUMNAS DISPONIBLES:', Object.keys(data[0]));
      } else {
        console.log('⚠️ LA TABLA ESTÁ VACÍA O RLS ESTÁ BLOQUEANDO LAS FILAS.');
        console.log('Si los datos existen en el dashboard de Supabase, es 100% un problema de RLS.');
      }
    }
  } catch (err) {
    console.error('❌ ERROR INESPERADO:', err.message);
  }
}

check();
