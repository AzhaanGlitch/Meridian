import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Target, 
  Settings, 
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = () => {
  const { 
    goals,
    setIsGoalModalOpen,
    setEditingGoal,
    setParentGoalContext
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateNew = () => {
    setEditingGoal(null);
    setParentGoalContext(null);
    setIsGoalModalOpen(true);
  };

  return (
    <aside className="w-16 hover:w-64 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-[#F1F5F9] flex flex-col justify-between h-screen sticky top-0 select-none z-30 group overflow-hidden flex-shrink-0">
      {/* Top Branding - Logo image */}
      <div className="py-4 px-2 space-y-4">
        {/* Top Branding - Logo image & Website Name */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 h-10 px-1 cursor-pointer"
          title="Go to Landing Page"
        >
          <div className="w-10 h-10 min-w-[40px] rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-[#0F172A] border border-[#E2E8F0] flex-shrink-0">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <span className="font-extrabold text-base tracking-tight text-[#0F172A] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Meridian
          </span>
        </div>

        {/* Goals Main Navigation Tab - Circular black highlight */}
        <nav className="space-y-2">
          <NavLink
            to="/goals"
            className={({ isActive }) =>
              `flex items-center gap-3 h-10 px-1 text-sm font-medium transition-colors ${
                isActive || location.pathname.startsWith('/goals')
                  ? 'text-[#0F172A]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`
            }
            title="Goals"
          >
            {({ isActive }) => (
              <>
                <div className={`w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center transition-all ${
                  isActive || location.pathname.startsWith('/goals')
                    ? 'bg-[#0F172A] text-white shadow-md'
                    : 'hover:bg-[#E2E8F0]'
                }`}>
                  <Target className="w-5 h-5 flex-shrink-0" />
                </div>
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-bold text-[#0F172A]">
                  Goals
                </span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Middle Section: Colorful Circular Numbered Tabs for Quick Goal Access (Parent Goals) */}
        <div className="pt-2 border-t border-[#E2E8F0] space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar">
          {goals
            .filter(g => !g.parentGoal || g.isParent)
            .map((goal, index) => {
              const isGoalActive = location.pathname.includes(`/goals/${goal._id}`) || location.pathname.includes(`/maps/${goal._id}`);
              return (
                <button
                  key={goal._id}
                  onClick={() => navigate(`/goals/${goal._id}`)}
                  className={`w-full flex items-center gap-3.5 h-9 px-2.5 rounded-xl text-left transition-colors duration-200 ${
                    isGoalActive ? 'bg-[#0F172A]/10 font-bold' : 'hover:bg-[#E2E8F0]'
                  }`}
                  title={goal.title}
                >
                  {/* Colorful Circular Tab with Goal Number */}
                  <div 
                    style={{ backgroundColor: goal.cardColor || '#FBBF24' }}
                    className="w-6 h-6 min-w-[24px] rounded-full flex items-center justify-center text-[#0F172A] font-extrabold text-[11px] shadow-xs flex-shrink-0 border border-black/10"
                  >
                    {index + 1}
                  </div>

                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium text-[#0F172A] truncate">
                    {goal.title}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Bottom Controls: Settings Tab & "+" New Goal Action Button */}
      <div className="p-2 mb-2 space-y-2 border-t border-[#E2E8F0]">
        {/* Settings Tab shifted to bottom right above "+" */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 h-10 px-1 text-sm font-medium transition-colors ${
              isActive
                ? 'text-[#0F172A]'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`
          }
          title="Settings"
        >
          {({ isActive }) => (
            <>
              <div className={`w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#0F172A] text-white shadow-md'
                  : 'hover:bg-[#E2E8F0]'
              }`}>
                <Settings className="w-5 h-5 flex-shrink-0" />
              </div>
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-semibold">
                Settings
              </span>
            </>
          )}
        </NavLink>

        {/* "+" New Goal Action Button - Circular button */}
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-3 h-10 px-1 text-sm font-semibold transition-all active:scale-95 cursor-pointer"
          title="Create New Goal / Note"
        >
          <div className="w-10 h-10 min-w-[40px] rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Plus className="w-5 h-5 flex-shrink-0" />
          </div>
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-bold text-[#0F172A]">
            New Goal
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
