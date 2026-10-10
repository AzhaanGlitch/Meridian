import React from 'react';
import { useApp } from '../context/AppContext';
import { CalendarRange, ChevronRight } from 'lucide-react';

const Roadmap = () => {
  const { goals } = useApp();

  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white min-h-full pb-12">
      <main className="px-8 py-8 space-y-6 max-w-7xl">
        {/* Uniform Page Heading */}
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Roadmap
        </h1>

        {/* Timeline Visual Matrix */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] soft-shadow p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-[#22D3EE]" />
              <span>{currentYear} Execution Horizon</span>
            </h3>
            <span className="text-xs font-semibold text-[#64748B]">
              {goals.length} Strategic Goals Scheduled
            </span>
          </div>

          {/* Timeline Columns Header */}
          <div className="grid grid-cols-12 gap-2 text-center text-xs font-extrabold text-[#64748B] pb-2 border-b border-[#E2E8F0]">
            {months.map(m => (
              <div key={m} className="bg-[#F1F5F9] py-1.5 rounded-lg text-[11px]">{m}</div>
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
