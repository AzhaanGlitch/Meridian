import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Sidebar from './components/Sidebar';
import GoalModal from './components/GoalModal';

import Landing from './pages/Landing';
import Goals from './pages/Goals';
import GoalDetail from './pages/GoalDetail';
import Maps from './pages/Maps';
import Roadmap from './pages/Roadmap';
import Settings from './pages/Settings';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-[#F1F5F9] overflow-hidden">
      {/* Base Page Sidebar */}
      <Sidebar />

      {/* Overlaid Large Rounded Border Card for Content */}
      <div className="flex-1 my-3 mr-3 bg-white rounded-3xl border border-[#E2E8F0] shadow-xl overflow-hidden flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

      <GoalModal />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Landing Page as default root */}
          <Route path="/" element={<Landing />} />
          
          {/* Main App Routes — Default directly to /goals */}
          <Route path="/goals" element={<Layout><Goals /></Layout>} />
          <Route path="/goals/:id" element={<Layout><GoalDetail /></Layout>} />
          <Route path="/maps" element={<Layout><Maps /></Layout>} />
          <Route path="/roadmap" element={<Layout><Roadmap /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/dashboard" element={<Navigate to="/goals" replace />} />
          <Route path="*" element={<Navigate to="/goals" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
