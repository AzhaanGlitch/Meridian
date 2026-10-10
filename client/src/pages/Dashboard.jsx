import React from 'react';
import Header from '../components/Header';
import GoalCard from '../components/GoalCard';
import { useApp } from '../context/AppContext';
import { 
  Target, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus, 
  Network, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

const Dashboard = () => {
  const { filteredGoals, goals, maps, setIsGoalModalOpen, setEditingGoal } = useApp();

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'In Progress').length;

  const avgProgress = totalGoals > 0 
    ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / totalGoals)
    : 0;

  // Chart Mock Data
  const progressData = [
    { day: 'Mon', completed: 2, created: 3 },
    { day: 'Tue', completed: 4, created: 2 },
    { day: 'Wed', completed: 3, created: 5 },
    { day: 'Thu', completed: 6, created: 4 },
    { day: 'Fri', completed: 8, created: 3 },
    { day: 'Sat', completed: 9, created: 2 },
    { day: 'Sun', completed: 12, created: 4 },
  ];

  const handleCreateNew = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9] pb-12">
      <Header title="Dashboard Overview" subtitle="Monitor active goals, productivity metrics, and upcoming deadlines" />

      <main className="px-8 py-6 space-y-8 max-w-7xl">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] soft-shadow flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#64748B]">Total Active Goals</span>
              <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{totalGoals}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/20 text-[#0F172A] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] soft-shadow flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#64748B]">In Progress</span>
              <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{inProgressGoals}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/20 text-[#0F172A] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] soft-shadow flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#64748B]">Completed</span>
              <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{completedGoals}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#A3E635]/20 text-[#0F172A] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] soft-shadow flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#64748B]">Avg Completion Rate</span>
              <p className="text-2xl font-extrabold text-[#0F172A] mt-1">{avgProgress}%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#C084FC]/20 text-[#0F172A] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Charts & Visual Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analytics Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E2E8F0] soft-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#0F172A] text-sm">Goal Activity & Task Streak</h3>
                <p className="text-xs text-[#64748B]">Weekly completed tasks vs newly created milestones</p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#86EFAC]/30 px-3 py-1 rounded-full text-xs font-bold text-[#0F172A]">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>7 Day Streak</span>
              </div>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '12px' }} 
                  />
                  <Area type="monotone" dataKey="completed" stroke="#0F172A" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Flow Map Preview Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] soft-shadow flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#22D3EE] text-[#0F172A] flex items-center justify-center font-bold mb-3 shadow-sm">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#0F172A] text-sm">Interactive Work Maps</h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Connect your goals into visual mindmaps and drag-and-drop flowcharts using React Flow.
              </p>
            </div>

            <div className="space-y-2 bg-[#F1F5F9] p-3 rounded-xl">
              <div className="text-[11px] font-bold text-[#64748B] uppercase">Active Maps</div>
              {maps.length > 0 ? (
                maps.slice(0, 2).map(m => (
                  <div key={m._id} className="text-xs font-semibold text-[#0F172A] truncate">
                    • {m.title} ({m.type})
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#64748B]">No maps created yet</div>
              )}
            </div>

            <Link
              to="/maps"
              className="w-full py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Open Visual Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Active Goals Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Active Goals & Notes</h2>
              <p className="text-xs text-[#64748B]">Organized in soft pastel sticky-note cards</p>
            </div>
            <Link to="/goals" className="text-xs font-bold text-[#0F172A] hover:underline flex items-center gap-1">
              View All Goals ({goals.length})
            </Link>
          </div>

          {filteredGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGoals.slice(0, 6).map((goal) => (
                <GoalCard key={goal._id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-[#E2E8F0] text-center space-y-4 soft-shadow">
              <div className="w-12 h-12 bg-[#FBBF24]/20 rounded-full flex items-center justify-center text-[#0F172A] mx-auto">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">No goals found</h3>
                <p className="text-xs text-[#64748B]">Create your first goal to get started.</p>
              </div>
              <button
                onClick={handleCreateNew}
                className="px-5 py-2.5 bg-[#0F172A] text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Goal</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
