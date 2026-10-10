import React from 'react';
import { Calendar, CheckCircle2, Clock, MoreVertical, Edit2, Trash2, ArrowUpRight, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';

const GoalCard = ({ goal }) => {
  const navigate = useNavigate();
  const { deleteGoal, updateGoal, setEditingGoal, setIsGoalModalOpen } = useApp();
  const [showMenu, setShowMenu] = React.useState(false);

  const completedTasks = goal.tasks ? goal.tasks.filter(t => t.completed).length : 0;
  const totalTasks = goal.tasks ? goal.tasks.length : 0;
  const progressPercent = goal.progress || (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);

  const handleTaskToggle = async (e, taskIndex) => {
    e.stopPropagation();
    const updatedTasks = [...(goal.tasks || [])];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
    
    await updateGoal(goal._id, { tasks: updatedTasks });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(goal._id);
    }
  };

  return (
    <div
      onClick={() => navigate(`/goals/${goal._id}`)}
      style={{ backgroundColor: goal.cardColor || '#FBBF24' }}
      className="p-5 rounded-2xl cursor-pointer card-hover relative group transition-all flex flex-col justify-between min-h-[220px] text-[#0F172A] border border-black/5"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/10 text-[#0F172A] backdrop-blur-sm">
              {goal.category || 'General'}
            </span>
            {goal.priority && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                goal.priority === 'Urgent' ? 'bg-red-500 text-white' :
                goal.priority === 'High' ? 'bg-orange-500 text-white' : 'bg-black/5 text-[#0F172A]'
              }`}>
                {goal.priority}
              </span>
            )}
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors text-[#0F172A]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-1 z-30">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Goal Title & Description */}
        <h3 className="font-bold text-base leading-snug mb-1 text-[#0F172A] line-clamp-2">
          {goal.title}
        </h3>
        {goal.description && (
          <p className="text-xs text-[#0F172A]/80 line-clamp-2 mb-3 font-normal">
            {goal.description}
          </p>
        )}

        {/* Task checklist snippet */}
        {goal.tasks && goal.tasks.length > 0 && (
          <div className="space-y-1.5 my-3 bg-white/40 p-2.5 rounded-xl backdrop-blur-xs">
            {goal.tasks.slice(0, 2).map((t, idx) => (
              <div
                key={idx}
                onClick={(e) => handleTaskToggle(e, idx)}
                className="flex items-center gap-2 text-xs font-medium text-[#0F172A] hover:opacity-80 cursor-pointer"
              >
                <div className={`w-3.5 h-3.5 rounded border border-black/30 flex items-center justify-center bg-white ${t.completed ? 'bg-[#0F172A]' : ''}`}>
                  {t.completed && <CheckSquare className="w-3 h-3 text-white" />}
                </div>
                <span className={`truncate ${t.completed ? 'line-through opacity-60' : ''}`}>{t.title}</span>
              </div>
            ))}
            {goal.tasks.length > 2 && (
              <span className="text-[10px] font-bold opacity-70 block pl-5">
                +{goal.tasks.length - 2} more tasks...
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Progress & Dates */}
      <div className="mt-4 pt-3 border-t border-black/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>

        <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#0F172A] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium text-[#0F172A]/80 pt-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{goal.dueDate ? format(new Date(goal.dueDate), 'MMM d') : 'No due date'}</span>
          </div>

          <div className="flex items-center gap-1 font-semibold hover:underline">
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
