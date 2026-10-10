import React, { useState } from 'react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';
import { CalendarRange, ChevronRight, Clock, Target, Plus } from 'lucide-react';
import { format, addMonths } from 'date-fns';

const Roadmap = () => {
  const { goals, setIsGoalModalOpen, setEditingGoal } = useApp();
  const [timeframe, setTimeframe] = useState('Monthly'); // 'Monthly', 'Quarterly', 'Yearly'

  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const quarters = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];

  const handleCreate = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9] pb-12">
      <Header title="Roadmap & Timeline" subtitle="Long-term strategy execution across months and quarters" />

      <main className="px-8 py-6 space-y-6 max-w-7xl">
        {/* View Switcher & Action Header */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] soft-shadow flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64748B] mr-2">Timeline View:</span>
            {['Monthly', 'Quarterly', 'Yearly'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  timeframe === tf ? 'bg-[#0F172A] text-white shadow-xs' : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Roadmap Milestone</span>
          </button>
        </div>

        {/* Timeline Visual Matrix */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] soft-shadow p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-[#22D3EE]" />
              <span>{currentYear} Execution Horizon ({timeframe})</span>
            </h3>
            <span className="text-xs font-semibold text-[#64748B]">
              {goals.length} Strategic Goals Scheduled
            </span>
          </div>

          {/* Timeline Columns Header */}
          <div className="grid grid-cols-12 gap-2 text-center text-xs font-extrabold text-[#64748B] pb-2 border-b border-[#E2E8F0]">
            {timeframe === 'Monthly' && months.map(m => (
              <div key={m} className="bg-[#F1F5F9] py-1.5 rounded-lg text-[11px]">{m}</div>
            ))}

            {timeframe === 'Quarterly' && quarters.map(q => (
              <div key={q} className="col-span-3 bg-[#F1F5F9] py-2 rounded-lg text-xs">{q}</div>
            ))}

            {timeframe === 'Yearly' && [2026, 2027, 2028].map(y => (
              <div key={y} className="col-span-4 bg-[#F1F5F9] py-2 rounded-lg text-xs">{y} Horizon</div>
            ))}
          </div>

          {/* Timeline Goal Bars */}
          <div className="space-y-4 pt-2">
            {goals.map((goal, idx) => {
              // Calculate horizontal span mock offset
              const spanCol = (idx % 4) * 3 + 1;
              const spanWidth = 4 + (idx % 3);

              return (
                <div key={goal._id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] px-1">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: goal.cardColor }} />
                      {goal.title}
                    </span>
                    <span className="text-[11px] text-[#64748B]">{goal.progress || 0}% Progress</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0]">
                    <div
                      style={{ 
                        gridColumnStart: spanCol, 
                        gridColumnEnd: `span ${Math.min(spanWidth, 12 - spanCol + 1)}`,
                        backgroundColor: goal.cardColor || '#FBBF24'
                      }}
                      className="py-2.5 px-4 rounded-xl shadow-xs text-[#0F172A] font-bold text-xs flex items-center justify-between truncate border border-black/5"
                    >
                      <span className="truncate">{goal.category} Milestone</span>
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
