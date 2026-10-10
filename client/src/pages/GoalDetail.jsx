import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit2, 
  Trash2, 
  CheckSquare, 
  Plus, 
  Share2, 
  Target,
  Subtitles,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteGoal, updateGoal, setEditingGoal, setIsGoalModalOpen } = useApp();
  
  const [goal, setGoal] = useState(null);
  const [subGoals, setSubGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchGoalDetails();
  }, [id]);

  const fetchGoalDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/goals/${id}`);
      setGoal(data.data);
      setSubGoals(data.data.subGoals || []);
    } catch (err) {
      console.error('Failed to fetch goal detail', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#F1F5F9] p-8 flex items-center justify-center">
        <div className="text-xs font-bold text-[#64748B] animate-pulse">Loading goal details...</div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="flex-1 bg-[#F1F5F9] p-8 text-center space-y-4">
        <h2 className="text-[#0F172A] font-bold">Goal not found</h2>
        <button onClick={() => navigate('/goals')} className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold">
          Back to Goals
        </button>
      </div>
    );
  }

  const handleTaskToggle = async (taskIndex) => {
    const updatedTasks = [...(goal.tasks || [])];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
    
    const res = await updateGoal(goal._id, { tasks: updatedTasks });
    if (res.success) {
      setGoal(res.data);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const updatedTasks = [...(goal.tasks || []), { title: newTaskTitle.trim(), completed: false }];
    const res = await updateGoal(goal._id, { tasks: updatedTasks });
    if (res.success) {
      setGoal(res.data);
      setNewTaskTitle('');
    }
  };

  const handleDelete = async () => {
    if (confirm('Delete this goal permanently?')) {
      await deleteGoal(goal._id);
      navigate('/goals');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9] pb-12">
      <Header title={goal.title} subtitle={`Category: ${goal.category}`} />

      <main className="px-8 py-6 space-y-6 max-w-5xl">
        {/* Back Link & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/goals')}
            className="flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Goals</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingGoal(goal);
                setIsGoalModalOpen(true);
              }}
              className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A] hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 hover:bg-red-100 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* Goal Main Pastel Card Header */}
        <div
          style={{ backgroundColor: goal.cardColor || '#FBBF24' }}
          className="p-8 rounded-3xl border border-black/5 soft-shadow text-[#0F172A] space-y-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-black/10 rounded-full text-xs font-bold">
              {goal.category}
            </span>
            <span className="px-3 py-1 bg-black/10 rounded-full text-xs font-bold">
              {goal.priority} Priority
            </span>
            <span className="px-3 py-1 bg-white/70 rounded-full text-xs font-bold">
              Status: {goal.status}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">{goal.title}</h1>

          {goal.description && (
            <p className="text-sm font-medium text-[#0F172A]/85 leading-relaxed max-w-3xl">
              {goal.description}
            </p>
          )}

          {/* Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Overall Progress</span>
              <span>{goal.progress || 0}%</span>
            </div>
            <div className="w-full bg-black/10 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#0F172A] h-full rounded-full transition-all duration-300"
                style={{ width: `${goal.progress || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Tasks & Sub-goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tasks Checklist */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] soft-shadow space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#22D3EE]" />
              <span>Milestone Tasks ({goal.tasks?.length || 0})</span>
            </h3>

            <div className="space-y-2">
              {goal.tasks && goal.tasks.length > 0 ? (
                goal.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleTaskToggle(idx)}
                    className="p-3 bg-[#F1F5F9] rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-200 transition-colors text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border border-[#0F172A] flex items-center justify-center ${task.completed ? 'bg-[#0F172A]' : 'bg-white'}`}>
                        {task.completed && <CheckSquare className="w-3 h-3 text-white" />}
                      </div>
                      <span className={task.completed ? 'line-through text-[#64748B]' : 'text-[#0F172A]'}>
                        {task.title}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#64748B] italic">No tasks added to this goal yet.</div>
              )}
            </div>

            {/* Quick Add Task */}
            <form onSubmit={handleAddTask} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add new sub-task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0F172A] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Add
              </button>
            </form>
          </div>

          {/* Sub-goals Hierarchy */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] soft-shadow space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#C084FC]" />
              <span>Hierarchical Sub-Goals ({subGoals.length})</span>
            </h3>

            {subGoals.length > 0 ? (
              <div className="space-y-3">
                {subGoals.map(sg => (
                  <Link
                    key={sg._id}
                    to={`/goals/${sg._id}`}
                    style={{ backgroundColor: sg.cardColor || '#FBBF24' }}
                    className="block p-4 rounded-xl border border-black/5 text-[#0F172A] hover:opacity-95 transition-opacity"
                  >
                    <h4 className="font-bold text-xs">{sg.title}</h4>
                    <p className="text-[11px] text-[#0F172A]/80 mt-1 line-clamp-1">{sg.description}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#64748B] italic">
                No child sub-goals. You can link child goals when creating or editing goals!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GoalDetail;
