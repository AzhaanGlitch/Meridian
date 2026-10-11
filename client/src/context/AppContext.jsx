import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const PASTEL_COLORS = [
  // Row 1: Warm Sunshine & Soft Corals
  { name: 'Warm Sun', hex: '#FDE047' },
  { name: 'Peach Cream', hex: '#FED7AA' },
  { name: 'Soft Apricot', hex: '#FDBA74' },
  { name: 'Coral Blush', hex: '#FCA5A5' },

  // Row 2: Fresh Mint & Soft Cyan
  { name: 'Soft Lime', hex: '#E9D5FF' ? '#D9F99D' : '#D9F99D' },
  { name: 'Fresh Mint', hex: '#86EFAC' },
  { name: 'Pastel Aqua', hex: '#99F6E4' },
  { name: 'Soft Cyan', hex: '#BAE6FD' },

  // Row 3: Sky Blue, Lavender & Pinks
  { name: 'Sky Blue', hex: '#93C5FD' },
  { name: 'Lavender Dream', hex: '#DDD6FE' },
  { name: 'Soft Magenta', hex: '#F5D0FE' },
  { name: 'Blush Pink', hex: '#FBCFE8' },

  // Row 4: Earthy Neutrals & Slate
  { name: 'Warm Taupe', hex: '#D6C0B3' },
  { name: 'Sand Beige', hex: '#E5D9B6' },
  { name: 'Light Slate', hex: '#E2E8F0' },
  { name: 'Dark Slate', hex: '#64748B' }
];

export const getContrastingTextColor = (hexColor) => {
  if (!hexColor) return '#0F172A';
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length !== 6) return '#0F172A';
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Calculate relative luminance / brightness (YIQ formula)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 140 ? '#F8FAFC' : '#0F172A';
};

export const CATEGORIES = [
  { name: 'Personal', color: '#FBBF24' },
  { name: 'Work', color: '#22D3EE' },
  { name: 'Career', color: '#C084FC' },
  { name: 'Health', color: '#A3E635' },
  { name: 'Finance', color: '#FB923C' },
  { name: 'Education', color: '#86EFAC' },
  { name: 'Projects', color: '#22D3EE' }
];

const INITIAL_GOALS = [];

const INITIAL_MAPS = [];

export const AppProvider = ({ children }) => {
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('meridian_goals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [maps, setMaps] = useState(() => {
    try {
      const saved = localStorage.getItem('meridian_maps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [parentGoalContext, setParentGoalContext] = useState(null);

  // Synchronize goals and maps to localStorage so user created cards persist
  React.useEffect(() => {
    try {
      localStorage.setItem('meridian_goals', JSON.stringify(goals));
    } catch (e) {
      console.error('Failed to save goals', e);
    }
  }, [goals]);

  React.useEffect(() => {
    try {
      localStorage.setItem('meridian_maps', JSON.stringify(maps));
    } catch (e) {
      console.error('Failed to save maps', e);
    }
  }, [maps]);

  const createGoal = async (goalData) => {
    const newGoal = {
      ...goalData,
      _id: `goal-${Date.now()}`,
      progress: 0
    };
    setGoals(prev => [newGoal, ...prev]);
    return { success: true };
  };

  const updateGoal = async (id, updateData) => {
    let updatedObj;
    setGoals(prev => prev.map(g => {
      if (g._id === id) {
        let tasks = updateData.tasks !== undefined ? updateData.tasks : g.tasks;
        let progress = g.progress;
        if (tasks && tasks.length > 0) {
          const completed = tasks.filter(t => t.completed).length;
          progress = Math.round((completed / tasks.length) * 100);
        }
        updatedObj = { ...g, ...updateData, tasks, progress };
        return updatedObj;
      }
      return g;
    }));
    return { success: true, data: updatedObj };
  };

  const deleteGoal = async (id) => {
    setGoals(prev => prev.filter(g => g._id !== id));
    return { success: true };
  };

  const createMap = async (mapData) => {
    const newMap = {
      ...mapData,
      _id: `map-${Date.now()}`
    };
    setMaps(prev => [newMap, ...prev]);
    return { success: true, data: newMap };
  };

  const updateMap = async (id, mapData) => {
    let updatedObj;
    setMaps(prev => prev.map(m => {
      if (m._id === id) {
        updatedObj = { ...m, ...mapData };
        return updatedObj;
      }
      return m;
    }));
    return { success: true, data: updatedObj };
  };

  const deleteMap = async (id) => {
    setMaps(prev => prev.filter(m => m._id !== id));
    return { success: true };
  };

  const filteredGoals = goals.filter(goal => {
    const matchesCategory = !selectedCategory || goal.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (goal.description && goal.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (goal.tags && goal.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const getGoalById = async (id) => {
    // Try backend API first, if it fails fallback to local state
    try {
      const { data } = await api.get(`/goals/${id}`);
      if (data && data.data) return { success: true, data: data.data };
    } catch (err) {
      console.warn('Backend API request failed, loading from local state:', err);
    }
    const found = goals.find(g => g._id === id);
    if (found) return { success: true, data: found };
    return { success: false };
  };

  return (
    <AppContext.Provider value={{
      goals,
      filteredGoals,
      maps,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      loading,
      createGoal,
      updateGoal,
      deleteGoal,
      getGoalById,
      createMap,
      updateMap,
      deleteMap,
      isGoalModalOpen,
      setIsGoalModalOpen,
      editingGoal,
      setEditingGoal,
      parentGoalContext,
      setParentGoalContext
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
