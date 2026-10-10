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
    <aside className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-white border-r border-[#E2E8F0] flex flex-col justify-between h-screen sticky top-0 select-none z-30 group overflow-hidden shadow-sm">
      {/* Top Branding - Only Logo image, no text */}
      <div className="p-3 space-y-6">
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="w-9 h-9 min-w-[36px] rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-[#0F172A] border border-[#E2E8F0]">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-sm font-semibold'
                      : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                  }`
                }
                title={item.label}
              >
                <Icon className="w-5 h-5 min-w-[20px] flex-shrink-0" />
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action Button - Icon only in collapsed state, text reveals on hover */}
      <div className="p-3 border-t border-[#E2E8F0]">
        <button
          onClick={handleCreateNew}
          className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer overflow-hidden"
          title="Create New Goal / Note"
        >
          <Plus className="w-5 h-5 min-w-[20px] flex-shrink-0" />
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden group-hover:inline">
            New Goal
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
