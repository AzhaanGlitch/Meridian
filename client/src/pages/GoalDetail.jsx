import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Edit2, 
  Trash2, 
  Plus, 
  Folder,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteGoal, setEditingGoal, setIsGoalModalOpen, setParentGoalContext, goals, getGoalById } = useApp();

  const [goal, setGoal] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Find child goals if this is a parent goal
  const childGoals = goals.filter(g => g.parentGoal === id);

  // Active focused goal (either parent or selected child)
  const activeFocusedGoal = selectedChildId 
    ? goals.find(g => g._id === selectedChildId) || goal 
    : goal;

  useEffect(() => {
    setSelectedChildId(null);
    fetchGoalDetails();
  }, [id, goals]);

  const fetchGoalDetails = async () => {
    setLoading(true);
    try {
      const res = await getGoalById(id);
      if (res && res.success) {
        setGoal(res.data);
      } else {
        setGoal(null);
      }
    } catch (err) {
      console.error('Failed to fetch goal detail', err);
      setGoal(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/goals');
  };

  const handleDelete = async () => {
    const target = activeFocusedGoal;
    if (confirm(`Delete "${target.title}" permanently?`)) {
      await deleteGoal(target._id);
      if (selectedChildId) {
        setSelectedChildId(null);
      } else {
        navigate('/goals');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all animate-in fade-in duration-200">
      {/* Centered Modal Overlay Card */}
      <div 
        className="w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            {goal && (
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: activeFocusedGoal?.cardColor || goal.cardColor || '#FBBF24' }} 
              />
            )}
            <h2 className="text-lg font-extrabold text-[#0F172A] truncate max-w-md">
              {loading ? 'Loading...' : selectedChildId ? `${goal?.title} / ${activeFocusedGoal?.title}` : goal?.title}
            </h2>
          </div>

          {/* Action Buttons & Close Icon */}
          <div className="flex items-center gap-2">
            {goal && (
              <>
                <button
                  onClick={() => {
                    setEditingGoal(activeFocusedGoal);
                    setIsGoalModalOpen(true);
                  }}
                  className="p-2 bg-white border border-[#E2E8F0] hover:bg-slate-100 text-[#0F172A] rounded-xl transition-colors"
                  title="Edit Card"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                  title="Delete Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={handleClose}
              className="p-2 bg-slate-200 hover:bg-slate-300 text-[#0F172A] rounded-xl transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <span className="text-xs font-bold text-[#64748B] animate-pulse">Loading card...</span>
            </div>
          ) : !goal ? (
            <div className="h-48 flex flex-col items-center justify-center space-y-4">
              <span className="text-sm font-bold text-[#0F172A]">Card not found</span>
              <button onClick={handleClose} className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold">
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Parent Breadcrumb Back Button if viewing a child goal */}
              {selectedChildId && (
                <button
                  onClick={() => setSelectedChildId(null)}
                  className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Parent Card ({goal.title})</span>
                </button>
              )}

              {/* Pastel Header Card (Title, Description, Color) */}
              <div
                style={{ backgroundColor: activeFocusedGoal.cardColor || '#FBBF24' }}
                className="p-6 rounded-3xl border border-black/5 text-[#0F172A] space-y-3 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-black/10 rounded-full text-xs font-extrabold">
                    {selectedChildId ? 'Child Card' : 'Parent Card'}
                  </span>
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight">{activeFocusedGoal.title}</h1>

                {activeFocusedGoal.description ? (
                  <p className="text-sm font-medium text-[#0F172A]/85 leading-relaxed">
                    {activeFocusedGoal.description}
                  </p>
                ) : (
                  <p className="text-xs italic text-[#0F172A]/60">No description provided for this card.</p>
                )}
              </div>

              {/* Child Cards Section (Only shown on Parent Cards) */}
              {!selectedChildId && (
                <div className="bg-slate-50 p-6 rounded-3xl border border-[#E2E8F0] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                      <Folder className="w-4 h-4 text-[#C084FC]" />
                      <span>Child Cards ({childGoals.length})</span>
                    </h3>

                    <button
                      onClick={() => {
                        setParentGoalContext(goal._id);
                        setEditingGoal(null);
                        setIsGoalModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Child Card</span>
                    </button>
                  </div>

                  {childGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {childGoals.map((cg) => (
                        <div
                          key={cg._id}
                          onClick={() => setSelectedChildId(cg._id)}
                          style={{ backgroundColor: cg.cardColor || '#FBBF24' }}
                          className="p-5 rounded-2xl border border-black/5 text-[#0F172A] cursor-pointer hover:scale-[1.02] transition-transform space-y-2 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 bg-black/10 rounded-full text-[10px] font-extrabold">
                              Child Card
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                          <h4 className="font-extrabold text-base leading-snug">{cg.title}</h4>
                          {cg.description && (
                            <p className="text-xs text-[#0F172A]/85 line-clamp-3 font-medium">{cg.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-[#64748B] italic py-3 text-center bg-white rounded-2xl border border-[#E2E8F0]">
                      No child cards yet. Click "+ Add Child Card" to create one under {goal.title}.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;
