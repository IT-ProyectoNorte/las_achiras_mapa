import { create } from 'zustand';
import { supabase } from '../lib/supabase';

function getDeviceView() {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w >= 1024) return 'desktop';
  if (w >= 640) return 'tablet';
  return 'mobile';
}

export const useStore = create((set, get) => ({
  tutorialDismissed: false,
  deviceView: getDeviceView(),
  selectedLotId: null,
  lotsData: [],
  loading: true,
  error: null,

  dismissTutorial: () => set({ tutorialDismissed: true }),
  setDeviceView: (view) => set({ deviceView: view }),
  setSelectedLotId: (id) => set({ selectedLotId: id }),
  
  initDeviceDetection: () => {
    const handleResize = () => set({ deviceView: getDeviceView() });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },
  
  fetchLotsData: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('Achiras')
        .select('*');

      if (error) {
        console.error('Error fetching from "Achiras" table:', error.message);
        set({ lotsData: [], loading: false, error: 'No se pudieron cargar los datos del loteo.' });
        return;
      }
      
      if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log(`✅ Loaded ${data.length} rows from "Achiras" table.`);
        console.log('Columns found:', columns);
        
        const expected = ['ID', 'Superficie', 'Precio', 'Orientacion', 'Manzana', 'Lote', 'Estado'];
        const missing = expected.filter(col => !columns.includes(col));
        if (missing.length > 0) {
          console.warn('⚠️ Table "Achiras" is missing these expected columns:', missing);
        }

        set({ lotsData: data, loading: false, error: null });
      } else {
        console.warn('⚠️ Table "Achiras" returned 0 rows.');
        set({ lotsData: [], loading: false, error: 'No hay datos disponibles.' });
      }
    } catch (err) {
      console.error('Unexpected error fetching from "Achiras":', err.message);
      set({ lotsData: [], loading: false, error: 'Error de conexión. Intenta recargar la página.' });
    }
  }
}));
