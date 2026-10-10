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
    <aside className="w-16 hover:w-64 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-[#F1F5F9] flex flex-col justify-between h-screen sticky top-0 select-none z-30 group overflow-hidden flex-shrink-0">
      {/* Top Branding - Perfectly Centered Icon/Logo */}
      <div className="py-4 px-2 space-y-6">
        <div className="flex items-center justify-start h-10 px-1">
          <div className="w-10 h-10 min-w-[40px] rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-[#0F172A] border border-[#E2E8F0]">
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

        {/* Main Navigation Links - Perfectly Centered Icons */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 h-10 px-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-md'
                      : 'text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                  }`
                }
                title={item.label}
              >
                {/* 20px Icon inside 24px container for perfect pixel alignment */}
                <div className="w-6 h-6 min-w-[24px] flex items-center justify-center">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-semibold">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action Button - Centered icon */}
      <div className="p-2 mb-2">
        <button
          onClick={handleCreateNew}
          className="w-full h-10 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl flex items-center justify-start px-2.5 gap-3.5 text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer overflow-hidden"
          title="Create New Goal / Note"
        >
          <div className="w-6 h-6 min-w-[24px] flex items-center justify-center">
            <Plus className="w-5 h-5 flex-shrink-0" />
          </div>
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-bold">
            New Goal
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
