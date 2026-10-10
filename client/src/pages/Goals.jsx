import React from 'react';
import GoalCard from '../components/GoalCard';
import { useApp } from '../context/AppContext';

const Goals = () => {
  const { filteredGoals } = useApp();

  // Filter top-level parent goals for main grid
  const parentGoals = filteredGoals.filter(g => !g.parentGoal || g.isParent);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white min-h-full">
      <main className="w-full px-8 py-8 space-y-6">
        {/* Page Heading */}
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Goals
        </h1>

        {/* Parent Goals Grid - 3 equal large columns */}
        {parentGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {parentGoals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-3xl border border-[#E2E8F0] text-center space-y-3 soft-shadow w-full">
            <h3 className="text-base font-bold text-[#0F172A]">No goals available</h3>
            <p className="text-xs text-[#64748B]">Click the "+" button on the sidebar to create your first parent goal.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Goals;
