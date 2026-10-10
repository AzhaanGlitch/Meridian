import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useApp, PASTEL_COLORS, CATEGORIES } from '../context/AppContext';

const GoalModal = () => {
  const { 
    isGoalModalOpen, 
    setIsGoalModalOpen, 
    editingGoal, 
    setEditingGoal, 
    createGoal, 
    updateGoal,
    goals
  } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    priority: 'Medium',
    status: 'In Progress',
    cardColor: '#FBBF24',
    dueDate: '',
    parentGoal: '',
    tags: '',
    tasks: []
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title || '',
        description: editingGoal.description || '',
        category: editingGoal.category || 'Personal',
        priority: editingGoal.priority || 'Medium',
        status: editingGoal.status || 'In Progress',
        cardColor: editingGoal.cardColor || '#FBBF24',
        dueDate: editingGoal.dueDate ? new Date(editingGoal.dueDate).toISOString().split('T')[0] : '',
        parentGoal: editingGoal.parentGoal || '',
        tags: editingGoal.tags ? editingGoal.tags.join(', ') : '',
        tasks: editingGoal.tasks || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Personal',
        priority: 'Medium',
        status: 'In Progress',
        cardColor: '#FBBF24',
        dueDate: '',
        parentGoal: '',
        tags: '',
        tasks: []
      });
    }
    setError('');
  }, [editingGoal, isGoalModalOpen]);

  if (!isGoalModalOpen) return null;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { title: newTaskTitle.trim(), completed: false }]
    }));
    setNewTaskTitle('');
  };

  const handleRemoveTask = (index) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      parentGoal: formData.parentGoal || null,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    };

    let result;
    if (editingGoal) {
      result = await updateGoal(editingGoal._id, payload);
    } else {
      result = await createGoal(payload);
    }

    setLoading(false);
    if (result.success) {
      setIsGoalModalOpen(false);
      setEditingGoal(null);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-[#0F172A]">
            {editingGoal ? 'Edit Goal / Note' : 'Create New Goal / Milestone'}
          </h2>
          <button
            onClick={() => setIsGoalModalOpen(false)}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-[#0F172A]">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Goal Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Launch SaaS MVP v1.0"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Description / Details</label>
            <textarea
              rows="3"
              placeholder="Add details, notes, or clear acceptance criteria..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
            />
          </div>

          {/* Pastel Card Color Picker */}
          <div>
            <label className="block font-bold text-[#0F172A] mb-1.5">Card Color (Pastel Accent)</label>
            <div className="flex items-center gap-3">
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
          </div>

          {/* Grid Category, Priority, Status */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 font-semibold"
              >
                {CATEGORIES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 font-semibold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 font-semibold"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Hierarchy & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Parent Goal (Optional)</label>
              <select
                value={formData.parentGoal}
                onChange={(e) => setFormData({ ...formData, parentGoal: e.target.value })}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 font-medium"
              >
                <option value="">None (Top-level Goal)</option>
                {goals
                  .filter(g => g._id !== editingGoal?._id)
                  .map(g => (
                    <option key={g._id} value={g._id}>{g.title}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 font-medium"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Tags (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g., MVP, Design, Frontend"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3.5 py-2 font-medium"
            />
          </div>

          {/* Action Tasks checklist */}
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Action Tasks Checklist</label>
            <div className="space-y-2 mb-2">
              {formData.tasks.map((task, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#F1F5F9] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
                  <span className="font-medium">{task.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add sub-task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-1.5 font-medium"
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="bg-[#0F172A] text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsGoalModalOpen(false)}
              className="px-4 py-2 rounded-xl font-semibold text-[#64748B] hover:bg-[#F1F5F9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
            >
              {loading ? 'Saving...' : editingGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
