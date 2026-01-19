
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Simulator from './components/Simulator';
import Comparison from './components/Comparison';
import ListingScanner from './components/ListingScanner';
import ZipMonitor from './components/ZipMonitor';
import { Property, ZipMonitor as ZipMonitorType } from './types';
import { INITIAL_PROPERTIES, INITIAL_ZIP_MONITORS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [zipMonitors, setZipMonitors] = useState<ZipMonitorType[]>(INITIAL_ZIP_MONITORS);

  const handleAddProperty = (newProp: Property) => {
    setProperties([newProp, ...properties]);
    // Note: We stay on the current tab if added via Dashboard modal
  };

  const handleScannerAdd = (newProp: Property) => {
    setProperties([newProp, ...properties]);
    setActiveTab('dashboard');
  };

  const handleAddZip = (zip: string, state: string) => {
    if (zipMonitors.some(z => z.zip === zip)) return;
    setZipMonitors([...zipMonitors, { zip, state, count: 0 }]);
  };

  const handleRemoveZip = (zip: string) => {
    setZipMonitors(zipMonitors.filter(z => z.zip !== zip));
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard properties={properties} onAddProperty={handleAddProperty} />}
          {activeTab === 'simulator' && <Simulator />}
          {activeTab === 'comparison' && <Comparison />}
          {activeTab === 'scanner' && <ListingScanner onAddProperty={handleScannerAdd} />}
          {activeTab === 'monitor' && (
            <ZipMonitor 
              monitors={zipMonitors} 
              onAddZip={handleAddZip} 
              onRemoveZip={handleRemoveZip} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
