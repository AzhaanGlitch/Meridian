import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useApp, PASTEL_COLORS } from '../context/AppContext';

const GoalModal = () => {
  const { 
    isGoalModalOpen, 
    setIsGoalModalOpen, 
    editingGoal, 
    setEditingGoal, 
    createGoal, 
    updateGoal,
    parentGoalContext,
    setParentGoalContext
  } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cardColor: '#FBBF24'
  });

  const [showExpandedPalette, setShowExpandedPalette] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title || '',
        description: editingGoal.description || '',
        cardColor: editingGoal.cardColor || '#FBBF24'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        cardColor: '#FBBF24'
      });
    }
    setError('');
  }, [editingGoal, isGoalModalOpen]);

  if (!isGoalModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      cardColor: formData.cardColor,
      category: 'General',
      priority: 'Medium',
      status: 'In Progress',
      progress: 0,
      isParent: parentGoalContext ? false : true,
      parentGoal: parentGoalContext || null,
      tasks: []
    };

    let result;
    if (editingGoal) {
      result = await updateGoal(editingGoal._id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        cardColor: formData.cardColor
      });
    } else {
      result = await createGoal(payload);
    }

    setLoading(false);
    if (result.success) {
      setIsGoalModalOpen(false);
      setEditingGoal(null);
      setParentGoalContext(null);
    } else {
      setError(result.message || 'Failed to save card');
    }
  };

  const isChildCreation = Boolean(parentGoalContext);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
          <h2 className="text-base font-extrabold text-[#0F172A]">
            {editingGoal 
              ? 'Edit Card' 
              : isChildCreation 
                ? 'Create Child Card' 
                : 'Create Parent Card'}
          </h2>
          <button
            onClick={() => {
              setIsGoalModalOpen(false);
              setEditingGoal(null);
              setParentGoalContext(null);
            }}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form: Title, Description, Color */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-[#0F172A]">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-bold text-[#0F172A] mb-1.5 text-xs">Title *</label>
            <input
              type="text"
              required
              placeholder={isChildCreation ? "Enter card title..." : "Enter goal title..."}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-4 py-2.5 font-semibold text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-[#0F172A] mb-1.5 text-xs">Description</label>
            <textarea
              rows="3"
              placeholder="Add brief description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-4 py-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
            />
          </div>

          {/* Pastel Card Color Picker with + Button to Expand Larger Palette */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-bold text-[#0F172A] text-xs">Card Color</label>
              <button
                type="button"
                onClick={() => setShowExpandedPalette(!showExpandedPalette)}
                className="text-[11px] font-bold text-[#22D3EE] bg-[#0F172A] px-2.5 py-0.5 rounded-full hover:bg-[#1E293B] transition-colors flex items-center gap-1"
              >
                <span>{showExpandedPalette ? 'Less colors' : '+ More colors'}</span>
              </button>
            </div>

            {showExpandedPalette ? (
              /* Expanded 16 Color Grid + Custom Hex Picker */
              <div className="space-y-3 bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
                <div className="grid grid-cols-8 gap-2">
                  {PASTEL_COLORS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, cardColor: c.hex })}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        formData.cardColor === c.hex ? 'border-[#0F172A] scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[11px] font-bold text-[#64748B]">Custom Color:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.cardColor}
                      onChange={(e) => setFormData({ ...formData, cardColor: e.target.value })}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-[#0F172A] uppercase">
                      {formData.cardColor}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Compact Inline Row with + Button */
              <div className="flex items-center justify-between gap-1.5">
                {PASTEL_COLORS.slice(0, 6).map(c => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, cardColor: c.hex })}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      formData.cardColor === c.hex ? 'border-[#0F172A] scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                    }`}
                    title={c.name}
                  />
                ))}
                
                {/* '+' Icon Button to expand larger palette */}
                <button
                  type="button"
                  onClick={() => setShowExpandedPalette(true)}
                  className="w-7 h-7 rounded-full border border-dashed border-[#0F172A] bg-slate-100 hover:bg-slate-200 text-[#0F172A] flex items-center justify-center transition-transform hover:scale-105 font-extrabold text-sm"
                  title="More colors"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsGoalModalOpen(false);
                setEditingGoal(null);
                setParentGoalContext(null);
              }}
              className="px-4 py-2 rounded-xl font-bold text-[#64748B] hover:bg-[#F1F5F9] text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
            >
              {loading ? 'Saving...' : editingGoal ? 'Update Card' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
