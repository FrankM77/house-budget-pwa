import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EnvelopeListView } from './views/EnvelopeListView';

function App() {
  // 1. State: Mimicking @State private var showingLaunchScreen
  const [showingLaunchScreen, setShowingLaunchScreen] = useState(true);

  // 2. Effect: Mimicking .onAppear { DispatchQueue... }
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowingLaunchScreen(false);
    }, 2000); // 2 second delay
    return () => clearTimeout(timer);
  }, []);

  // 3. Splash Screen View
  if (showingLaunchScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-blue-600 text-white">
        {/* Simple Launch Screen Animation */}
        <div className="text-3xl font-bold animate-pulse">
          House Budget
        </div>
      </div>
    );
  }

  // 4. Main App View (WindowGroup)
  return (
    <BrowserRouter>
      <Routes>
        {/* This maps URL "/" to your EnvelopeListView */}
        <Route path="/" element={<EnvelopeListView />} />
        
        {/* We will build SettingsView later */}
        <Route path="/settings" element={<div className="p-4">Settings Page Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;