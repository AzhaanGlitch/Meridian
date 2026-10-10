import React from 'react';
import { Calendar, CheckCircle2, Clock, MoreVertical, Edit2, Trash2, ArrowUpRight, CheckSquare, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';
import FlipCard from './FlipCard';

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

  const openGoalDetails = (e) => {
    e.stopPropagation();
    navigate(`/goals/${goal._id}`);
  };

  // Front Side of FlipCard (Pastel Note Preview & Direct Details Link)
  const FrontSide = (
    <div
      onClick={openGoalDetails}
      style={{ backgroundColor: goal.cardColor || '#FBBF24' }}
      className="w-full h-full p-6 flex flex-col justify-between text-[#0F172A] relative select-none border border-black/5 cursor-pointer"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/10 text-[#0F172A] backdrop-blur-sm">
              {goal.category || 'General'}
            </span>
            {goal.isParent && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0F172A] text-white">
                Parent Card
              </span>
            )}
            {goal.priority && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                goal.priority === 'Urgent' ? 'bg-red-500 text-white' :
                goal.priority === 'High' ? 'bg-orange-500 text-white' : 'bg-black/5 text-[#0F172A]'
              }`}>
                {goal.priority}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={openGoalDetails}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors text-[#0F172A]"
              title="Open Goal Details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="relative z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded-lg hover:bg-black/10 transition-colors text-[#0F172A]"
                title="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-1 z-50">
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
        </div>

        <h3 className="font-bold text-lg leading-snug mb-2 text-[#0F172A] line-clamp-2">
          {goal.title}
        </h3>
        {goal.description && (
          <p className="text-xs text-[#0F172A]/80 line-clamp-4 mb-3 font-normal leading-relaxed">
            {goal.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-black/10 space-y-2">
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
          <span className="text-[10px] font-bold opacity-75 flex items-center gap-1">
            <RotateCw className="w-3 h-3" /> Drag to Spin
          </span>
        </div>
      </div>
    </div>
  );

  // Back Side of FlipCard (Tasks Checklist & Options)
  const BackSide = (
    <div
      style={{ backgroundColor: goal.cardColor || '#FBBF24' }}
      className="w-full h-full p-6 flex flex-col justify-between text-[#0F172A] relative select-none border border-black/5"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]/70">
            Checklist & Tasks
          </span>

          <div className="relative z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors text-[#0F172A]"
              title="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-1 z-50">
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

        <div className="space-y-2 my-2 bg-white/50 p-3 rounded-xl backdrop-blur-xs max-h-[220px] overflow-y-auto">
          {goal.tasks && goal.tasks.length > 0 ? (
            goal.tasks.map((t, idx) => (
              <div
                key={idx}
                onClick={(e) => handleTaskToggle(e, idx)}
                className="flex items-center gap-2 text-xs font-medium text-[#0F172A] hover:opacity-80 cursor-pointer"
              >
                <div className={`w-4 h-4 rounded border border-black/30 flex items-center justify-center bg-white ${t.completed ? 'bg-[#0F172A]' : ''}`}>
                  {t.completed && <CheckSquare className="w-3 h-3 text-white" />}
                </div>
                <span className={`truncate ${t.completed ? 'line-through opacity-60' : ''}`}>{t.title}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-[#0F172A]/70 italic">No tasks added to this goal.</div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs">
        <button
          onClick={openGoalDetails}
          className="px-3.5 py-1.5 bg-[#0F172A] text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm hover:bg-[#1E293B] cursor-pointer"
        >
          <span>Full Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] font-bold opacity-75">Drag to Spin</span>
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      <FlipCard
        front={FrontSide}
        back={BackSide}
        axis="y"
        flipOnClick={false}
        draggable={true}
        dragDistance={300}
        tilt={true}
        tiltMax={15}
        glare={true}
        glareOpacity={0.2}
        hoverScale={1.03}
        perspective={1100}
        stiffness={170}
        damping={20}
        width="100%"
        height={340}
        radius={24}
        background={goal.cardColor || '#FBBF24'}
        color="#0F172A"
        shadow={true}
        shadowColor="#000000"
        shadowOpacity={0.18}
      />
    </div>
  );
};

export default GoalCard;
