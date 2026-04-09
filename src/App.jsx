import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import Tutorial from './components/Tutorial';
import MapScreen from './components/MapScreen';

function App() {
  const tutorialDismissed = useStore(state => state.tutorialDismissed);
  const deviceView = useStore(state => state.deviceView);
  const initDeviceDetection = useStore(state => state.initDeviceDetection);

  useEffect(() => {
    const cleanup = initDeviceDetection();
    return cleanup;
  }, [initDeviceDetection]);

  if (!tutorialDismissed) {
    return <Tutorial />;
  }

  return (
    <div className="w-full min-h-screen font-nexa bg-white selection:bg-azul1 selection:text-white">
      <MapScreen deviceView={deviceView} />
    </div>
  );
}

export default App;
