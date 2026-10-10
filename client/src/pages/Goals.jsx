import React, { useState } from 'react';
import GoalCard from '../components/GoalCard';
import { useApp } from '../context/AppContext';
import { Plus, LayoutGrid, List } from 'lucide-react';

const Goals = () => {
  const { filteredGoals, setIsGoalModalOpen, setEditingGoal } = useApp();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const handleCreate = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const displayedGoals = filteredGoals.filter(goal => {
    const matchesStatus = selectedStatus === 'All' || goal.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || goal.priority === selectedPriority;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white min-h-full pb-12">
      <main className="px-8 py-6 space-y-6 max-w-7xl">
        {/* Clean Floating Filter Bar */}
        <div className="bg-[#F1F5F9]/60 p-2.5 rounded-2xl border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-xl border border-[#E2E8F0]">
              {['All', 'In Progress', 'Completed', 'Not Started', 'On Hold'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedStatus === status ? 'bg-[#0F172A] text-white shadow-xs font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-white/80 border border-[#E2E8F0] text-[#0F172A] rounded-xl px-3 py-1.5 font-semibold focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/80 border border-[#E2E8F0] p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#0F172A] text-white' : 'text-[#64748B]'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#0F172A] text-white' : 'text-[#64748B]'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleCreate}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Goal</span>
            </button>
          </div>
        </div>

        {/* Goals Listing */}
        {displayedGoals.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedGoals.map((goal) => (
                <GoalCard key={goal._id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden soft-shadow divide-y divide-[#E2E8F0]">
              {displayedGoals.map(goal => (
                <div key={goal._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: goal.cardColor }} />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#0F172A] truncate">{goal.title}</h4>
                      <p className="text-xs text-[#64748B] truncate">{goal.category} • Due: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : 'No Date'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#0F172A]">{goal.status}</span>
                    <span className="w-16 text-right font-bold text-[#0F172A]">{goal.progress || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white p-16 rounded-3xl border border-[#E2E8F0] text-center space-y-3 soft-shadow">
            <h3 className="text-base font-bold text-[#0F172A]">No goals match your criteria</h3>
            <p className="text-xs text-[#64748B]">Try adjusting your search keywords, priority, or category filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Goals;
