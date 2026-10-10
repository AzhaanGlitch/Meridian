import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header = ({ title = "Dashboard", subtitle }) => {
  const { searchQuery, setSearchQuery, setIsGoalModalOpen, setEditingGoal } = useApp();

  const handleCreate = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  return (
    <header className="sticky top-0 bg-[#F1F5F9]/80 backdrop-blur-md z-10 px-8 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-[#64748B] font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search goals, tasks, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0F172A] shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#0F172A]"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleCreate}
          className="w-9 h-9 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 flex-shrink-0"
          title="Create New Goal"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
