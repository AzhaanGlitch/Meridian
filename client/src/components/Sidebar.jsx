import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Network, 
  CalendarRange, 
  Settings, 
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = () => {
  const { 
    setIsGoalModalOpen,
    setEditingGoal
  } = useApp();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Goals & Tasks', icon: Target, path: '/goals' },
    { label: 'Work Maps & Flow', icon: Network, path: '/maps' },
    { label: 'Roadmap', icon: CalendarRange, path: '/roadmap' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleCreateNew = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between h-screen sticky top-0 select-none z-20">
      {/* Top Branding with logo.jpg from public folder */}
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-[#0F172A] border border-[#E2E8F0]">
              <img 
                src="/logo.jpg" 
                alt="Meridian Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-[#0F172A] tracking-tight">Meridian</h1>
              <span className="text-[11px] font-medium text-[#64748B] tracking-wider uppercase">Planning Studio</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-sm font-semibold'
                      : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action Button */}
      <div className="p-4 border-t border-[#E2E8F0]">
        <button
          onClick={handleCreateNew}
          className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal / Note</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
