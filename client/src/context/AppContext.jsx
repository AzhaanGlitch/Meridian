import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const PASTEL_COLORS = [
  { name: 'Warm Yellow', hex: '#FBBF24', bg: 'bg-[#FBBF24]' },
  { name: 'Coral Orange', hex: '#FB923C', bg: 'bg-[#FB923C]' },
  { name: 'Soft Purple', hex: '#C084FC', bg: 'bg-[#C084FC]' },
  { name: 'Lime Green', hex: '#A3E635', bg: 'bg-[#A3E635]' },
  { name: 'Mint Green', hex: '#86EFAC', bg: 'bg-[#86EFAC]' },
  { name: 'Sky Cyan', hex: '#22D3EE', bg: 'bg-[#22D3EE]' },
];

export const CATEGORIES = [
  { name: 'Personal', color: '#FBBF24' },
  { name: 'Work', color: '#22D3EE' },
  { name: 'Career', color: '#C084FC' },
  { name: 'Health', color: '#A3E635' },
  { name: 'Finance', color: '#FB923C' },
  { name: 'Education', color: '#86EFAC' },
  { name: 'Projects', color: '#22D3EE' }
];

const INITIAL_GOALS = [
  {
    _id: 'goal-1',
    title: 'Launch SaaS Platform v1.0',
    description: 'Build, test and launch our core MVP to early adopters and get first 100 paid users.',
    status: 'In Progress',
    priority: 'High',
    category: 'Work',
    cardColor: '#FBBF24',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    progress: 65,
    tags: ['SaaS', 'MVP', 'Launch'],
    tasks: [
      { title: 'Finalize UI Mockups in Figma', completed: true },
      { title: 'Setup Node.js & MongoDB backend schema', completed: true },
      { title: 'Build React Flow interactive map visualizer', completed: true },
      { title: 'Configure Payment Gateway Integration', completed: false },
      { title: 'Perform Beta Testing & Bug Fixes', completed: false }
    ]
  },
  {
    _id: 'goal-2',
    title: 'Design Marketing Landing Page',
    description: 'Convert visitors with clear hero sections, interactive demo cards, and pricing table.',
    status: 'In Progress',
    priority: 'Medium',
    category: 'Work',
    cardColor: '#FB923C',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    progress: 50,
    tags: ['Marketing', 'Design'],
    tasks: [
      { title: 'Draft value proposition headline', completed: true },
      { title: 'Design high-converting pricing cards', completed: false }
    ]
  },
  {
    _id: 'goal-3',
    title: 'Full Stack Engineering Mastery',
    description: 'Master React 19, TypeScript, Express, microservices architecture, and system design.',
    status: 'In Progress',
    priority: 'High',
    category: 'Career',
    cardColor: '#C084FC',
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    progress: 40,
    tags: ['Skill', 'Engineering', 'Learning'],
    tasks: [
      { title: 'Complete Advanced React Patterns course', completed: true },
      { title: 'Build 3 full stack projects with authentication', completed: true },
      { title: 'Read System Design Interview Book Vol 1 & 2', completed: false }
    ]
  },
  {
    _id: 'goal-4',
    title: 'Marathon Fitness Training',
    description: 'Prepare for the autumn half-marathon by running 4 times a week with structured endurance recovery.',
    status: 'In Progress',
    priority: 'Medium',
    category: 'Health',
    cardColor: '#A3E635',
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    progress: 80,
    tags: ['Fitness', 'Running', 'Health'],
    tasks: [
      { title: 'Run 10k baseline time trial', completed: true },
      { title: 'Increase long weekend run to 15km', completed: true },
      { title: 'Hydration and electrolyte protocol', completed: true },
      { title: 'Complete 21km practice run', completed: false }
    ]
  },
  {
    _id: 'goal-5',
    title: 'Read 12 Non-Fiction Books This Year',
    description: 'Read 1 book per month focusing on psychology, product strategy, philosophy, and personal growth.',
    status: 'In Progress',
    priority: 'Low',
    category: 'Personal',
    cardColor: '#86EFAC',
    dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    progress: 58,
    tags: ['Reading', 'Habits'],
    tasks: [
      { title: 'Atomic Habits by James Clear', completed: true },
      { title: 'Deep Work by Cal Newport', completed: true },
      { title: 'The Lean Startup by Eric Ries', completed: true },
      { title: 'Thinking, Fast and Slow', completed: false }
    ]
  },
  {
    _id: 'goal-6',
    title: 'Seed Funding Investment Pitch',
    description: 'Prepare deck, financial projections model, and pitch to angel investors.',
    status: 'Not Started',
    priority: 'Urgent',
    category: 'Finance',
    cardColor: '#22D3EE',
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    progress: 10,
    tags: ['Pitch', 'Investor', 'Finance'],
    tasks: [
      { title: 'Draft 10-slide pitch deck', completed: true },
      { title: 'Calculate 3-year cash flow projections', completed: false }
    ]
  }
];

const INITIAL_MAPS = [
  {
    _id: 'map-1',
    title: 'Meridian Product Architecture Mind Map',
    type: 'mindmap',
    cardColor: '#22D3EE',
    nodes: [
      {
        id: '1',
        type: 'input',
        data: { label: 'Meridian App Engine' },
        position: { x: 250, y: 50 },
        style: { background: '#0F172A', color: '#fff', borderRadius: '12px', padding: '12px 20px', fontWeight: 'bold' }
      },
      {
        id: '2',
        data: { label: 'React + Vite Client' },
        position: { x: 100, y: 180 },
        style: { background: '#FBBF24', color: '#0F172A', borderRadius: '12px', padding: '10px 16px', border: 'none', fontWeight: 'semibold' }
      },
      {
        id: '3',
        data: { label: 'Node.js Express API' },
        position: { x: 400, y: 180 },
        style: { background: '#C084FC', color: '#0F172A', borderRadius: '12px', padding: '10px 16px', border: 'none', fontWeight: 'semibold' }
      },
      {
        id: '4',
        data: { label: 'MongoDB Database' },
        position: { x: 400, y: 300 },
        style: { background: '#86EFAC', color: '#0F172A', borderRadius: '12px', padding: '10px 16px', border: 'none', fontWeight: 'semibold' }
      },
      {
        id: '5',
        data: { label: 'React Flow Canvas' },
        position: { x: 100, y: 300 },
        style: { background: '#22D3EE', color: '#0F172A', borderRadius: '12px', padding: '10px 16px', border: 'none', fontWeight: 'semibold' }
      }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#0F172A', strokeWidth: 2 } },
      { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#0F172A', strokeWidth: 2 } },
      { id: 'e3-4', source: '3', target: '4', style: { stroke: '#0F172A', strokeWidth: 2 } },
      { id: 'e2-5', source: '2', target: '5', style: { stroke: '#0F172A', strokeWidth: 2 } }
    ]
  }
];

export const AppProvider = ({ children }) => {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [maps, setMaps] = useState(INITIAL_MAPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

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
      setEditingGoal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
