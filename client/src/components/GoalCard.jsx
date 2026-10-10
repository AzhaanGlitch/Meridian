import React from 'react';
import { MoreVertical, Edit2, Trash2, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FlipCard from './FlipCard';

const GoalCard = ({ goal }) => {
  const navigate = useNavigate();
  const { deleteGoal, setEditingGoal, setIsGoalModalOpen } = useApp();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      await deleteGoal(goal._id);
    }
  };

  const openGoalDetails = (e) => {
    e.stopPropagation();
    navigate(`/goals/${goal._id}`);
  };

  // Card view content (Title, Description, Color)
  const CardContent = (
    <div
      onClick={openGoalDetails}
      style={{ backgroundColor: goal.cardColor || '#FBBF24' }}
      className="w-full h-full p-6 flex flex-col justify-between text-[#0F172A] relative select-none border border-black/5 cursor-pointer rounded-3xl shadow-sm"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-extrabold px-3 py-1 bg-black/10 rounded-full text-[#0F172A]">
            {goal.isParent ? 'Parent Card' : 'Child Card'}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={openGoalDetails}
              className="p-1.5 rounded-xl hover:bg-black/10 transition-colors text-[#0F172A]"
              title="Open Card"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="relative z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 rounded-xl hover:bg-black/10 transition-colors text-[#0F172A]"
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

        <h3 className="font-extrabold text-xl leading-snug mb-2 text-[#0F172A] line-clamp-2">
          {goal.title}
        </h3>
        {goal.description && (
          <p className="text-xs text-[#0F172A]/85 line-clamp-5 font-medium leading-relaxed">
            {goal.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs font-bold text-[#0F172A]">
        <span>Click card to view details</span>
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      <FlipCard
        front={CardContent}
        back={CardContent}
        axis="y"
        flipOnClick={false}
        draggable={false}
        tilt={true}
        tiltMax={10}
        glare={true}
        glareOpacity={0.15}
        hoverScale={1.02}
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
        shadowOpacity={0.15}
      />
    </div>
  );
};

export default GoalCard;
