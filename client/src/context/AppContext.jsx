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
  // Parent Goals (Top Level - isParent: true or parentGoal: null)
  {
    _id: 'parent-1',
    title: 'Academics',
    description: 'Core university coursework, lecture attendance, research papers, and academic excellence.',
    status: 'In Progress',
    priority: 'High',
    category: 'Education',
    cardColor: '#FBBF24',
    isParent: true,
    parentGoal: null,
    dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    progress: 70,
    tags: ['Academics', 'University'],
    tasks: [
      { title: 'Maintain 3.8+ GPA across all modules', completed: true },
      { title: 'Submit Machine Learning research paper draft', completed: false }
    ]
  },
  {
    _id: 'parent-2',
    title: 'Development',
    description: 'Full stack web applications, software engineering mastery, side projects, and open source.',
    status: 'In Progress',
    priority: 'High',
    category: 'Work',
    cardColor: '#22D3EE',
    isParent: true,
    parentGoal: null,
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    progress: 60,
    tags: ['Development', 'SaaS', 'Engineering'],
    tasks: [
      { title: 'Complete Meridian React + Vite App', completed: true },
      { title: 'Deploy production API to cloud hosting', completed: false }
    ]
  },
  {
    _id: 'parent-3',
    title: 'Term End Exams',
    description: 'Comprehensive exam revision, mock paper practice, formulas memorization, and final grade preparation.',
    status: 'In Progress',
    priority: 'Urgent',
    category: 'Education',
    cardColor: '#C084FC',
    isParent: true,
    parentGoal: null,
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    progress: 45,
    tags: ['Exams', 'Revision'],
    tasks: [
      { title: 'Solve 5 previous years question papers', completed: true },
      { title: 'Create quick revision flashcards for all subjects', completed: false }
    ]
  },

  // Child Goals (under Parent Goals)
  {
    _id: 'child-1',
    parentGoal: 'parent-1',
    title: 'Advanced Data Structures & Algorithms',
    description: 'Master Graphs, Dynamic Programming, Trees, and solve 150+ LeetCode problems.',
    status: 'In Progress',
    priority: 'High',
    category: 'Education',
    cardColor: '#FBBF24',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    progress: 75,
    tags: ['DSA', 'LeetCode'],
    tasks: [
      { title: 'Solve Top 50 Array & String Questions', completed: true },
      { title: 'Master Dynamic Programming Patterns', completed: true },
      { title: 'Graph Traversal & Shortest Path algorithms', completed: false }
    ]
  },
  {
    _id: 'child-2',
    parentGoal: 'parent-1',
    title: 'Operating Systems & Database Systems',
    description: 'Study Process Scheduling, Memory Management, Relational Schema Normalization and Indexing.',
    status: 'In Progress',
    priority: 'Medium',
    category: 'Education',
    cardColor: '#86EFAC',
    dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    progress: 60,
    tags: ['OS', 'DBMS'],
    tasks: [
      { title: 'Write B-Tree and Hash Indexing notes', completed: true },
      { title: 'Implement Producer-Consumer Synchronization', completed: true }
    ]
  },
  {
    _id: 'child-3',
    parentGoal: 'parent-2',
    title: 'Launch SaaS Platform v1.0',
    description: 'Build, test and launch our core MVP to early adopters and get first 100 paid users.',
    status: 'In Progress',
    priority: 'High',
    category: 'Work',
    cardColor: '#FB923C',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    progress: 65,
    tags: ['SaaS', 'MVP', 'Launch'],
    tasks: [
      { title: 'Finalize UI Mockups in Figma', completed: true },
      { title: 'Setup Node.js & MongoDB backend schema', completed: true },
      { title: 'Build React Flow interactive map visualizer', completed: true },
      { title: 'Configure Payment Gateway Integration', completed: false }
    ]
  },
  {
    _id: 'child-4',
    parentGoal: 'parent-2',
    title: 'Design Marketing Landing Page',
    description: 'Convert visitors with clear hero sections, interactive demo cards, and pricing table.',
    status: 'In Progress',
    priority: 'Medium',
    category: 'Work',
    cardColor: '#A3E635',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    progress: 50,
    tags: ['Marketing', 'Design'],
    tasks: [
      { title: 'Draft value proposition headline', completed: true },
      { title: 'Design high-converting pricing cards', completed: false }
    ]
  },
  {
    _id: 'child-5',
    parentGoal: 'parent-3',
    title: 'Computer Networks & Security Mock Revision',
    description: 'Revise TCP/IP stack, Socket programming, RSA Encryption, and Wireless Protocol security.',
    status: 'In Progress',
    priority: 'Urgent',
    category: 'Education',
    cardColor: '#C084FC',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    progress: 40,
    tags: ['Networks', 'Security'],
    tasks: [
      { title: 'Revise OSI 7 Layer Protocol details', completed: true },
      { title: 'Practice Subnetting math numerical problems', completed: false }
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
