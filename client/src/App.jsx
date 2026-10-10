import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Sidebar from './components/Sidebar';
import GoalModal from './components/GoalModal';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import GoalDetail from './pages/GoalDetail';
import Maps from './pages/Maps';
import Roadmap from './pages/Roadmap';
import Settings from './pages/Settings';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
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
          
          {/* Main App Routes */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/goals" element={<Layout><Goals /></Layout>} />
          <Route path="/goals/:id" element={<Layout><GoalDetail /></Layout>} />
          <Route path="/maps" element={<Layout><Maps /></Layout>} />
          <Route path="/roadmap" element={<Layout><Roadmap /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
