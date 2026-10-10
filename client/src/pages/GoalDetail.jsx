import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp, PASTEL_COLORS } from '../context/AppContext';
import api from '../services/api';
import ReactFlow, { Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  X, 
  Edit2, 
  Trash2, 
  CheckSquare, 
  Plus, 
  Map, 
  CalendarRange, 
  FileText,
  ChevronRight,
  Save,
  Check
} from 'lucide-react';

const GoalDetail = ({ initialTab = 'details' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { deleteGoal, updateGoal, setEditingGoal, setIsGoalModalOpen, goals } = useApp();

  // Determine active tab based on route or prop
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.endsWith('/map')) return 'map';
    if (location.pathname.endsWith('/roadmap')) return 'roadmap';
    return initialTab;
  });

  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // React Flow state for Map tab
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [selectedNodeColor, setSelectedNodeColor] = useState('#22D3EE');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (location.pathname.endsWith('/map')) setActiveTab('map');
    else if (location.pathname.endsWith('/roadmap')) setActiveTab('roadmap');
    else setActiveTab('details');
  }, [location.pathname]);

  useEffect(() => {
    fetchGoalDetails();
  }, [id]);

  const fetchGoalDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/goals/${id}`);
      const gData = data.data;
      setGoal(gData);

      // Initialize React Flow map nodes/edges from goal or default template
      if (gData.nodes && gData.nodes.length > 0) {
        setNodes(gData.nodes);
        setEdges(gData.edges || []);
      } else {
        setNodes([
          {
            id: 'root-1',
            type: 'input',
            data: { label: gData.title },
            position: { x: 250, y: 50 },
            style: { background: '#0F172A', color: '#fff', borderRadius: '12px', padding: '12px 20px', fontWeight: 'bold' }
          },
          ...(gData.tasks || []).map((t, idx) => ({
            id: `task-${idx}`,
            data: { label: t.title },
            position: { x: 100 + (idx % 3) * 180, y: 180 + Math.floor(idx / 3) * 100 },
            style: { background: gData.cardColor || '#FBBF24', color: '#0F172A', borderRadius: '12px', padding: '10px 16px', border: 'none', fontWeight: '600' }
          }))
        ]);
        setEdges(
          (gData.tasks || []).map((_, idx) => ({
            id: `e-root-task-${idx}`,
            source: 'root-1',
            target: `task-${idx}`,
            animated: true,
            style: { stroke: '#0F172A', strokeWidth: 2 }
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch goal detail', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/goals');
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'details') navigate(`/goals/${id}`);
    else if (tab === 'map') navigate(`/goals/${id}/map`);
    else if (tab === 'roadmap') navigate(`/goals/${id}/roadmap`);
  };

  const handleTaskToggle = async (taskIndex) => {
    const updatedTasks = [...(goal.tasks || [])];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
    const res = await updateGoal(goal._id, { tasks: updatedTasks });
    if (res.success) setGoal(res.data);
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

  // React Flow Handlers
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#0F172A', strokeWidth: 2 } }, eds)),
    []
  );

  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return;
    const newNode = {
      id: `${Date.now()}`,
      data: { label: newNodeLabel.trim() },
      position: { x: 200 + Math.random() * 60, y: 200 + Math.random() * 60 },
      style: { 
        background: selectedNodeColor, 
        color: '#0F172A', 
        borderRadius: '12px', 
        padding: '10px 16px', 
        border: 'none',
        fontWeight: '600'
      }
    };
    setNodes((prev) => [...prev, newNode]);
    setNewNodeLabel('');
  };

  const handleSaveMap = async () => {
    const res = await updateGoal(goal._id, { nodes, edges });
    if (res.success) {
      setGoal(res.data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all animate-in fade-in duration-200">
      {/* Centered Large Card */}
      <div 
        className="w-full max-w-5xl h-[88vh] bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Navigation Bar */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            {goal && (
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: goal.cardColor || '#FBBF24' }} 
              />
            )}
            <h2 className="text-lg font-extrabold text-[#0F172A] truncate max-w-md">
              {loading ? 'Loading Goal...' : goal?.title}
            </h2>
          </div>

          {/* Center Tabs: Details / Work Map / Roadmap */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <button
              onClick={() => handleTabSwitch('details')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'details' ? 'bg-[#0F172A] text-white' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            <button
              onClick={() => handleTabSwitch('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'map' ? 'bg-[#0F172A] text-[#22D3EE]' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Work Map</span>
            </button>

            <button
              onClick={() => handleTabSwitch('roadmap')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'roadmap' ? 'bg-[#0F172A] text-[#C084FC]' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>
          </div>

          {/* Action Buttons & Close Icon */}
          <div className="flex items-center gap-2">
            {goal && (
              <>
                <button
                  onClick={() => {
                    setEditingGoal(goal);
                    setIsGoalModalOpen(true);
                  }}
                  className="p-2 bg-white border border-[#E2E8F0] hover:bg-slate-100 text-[#0F172A] rounded-xl transition-colors"
                  title="Edit Goal"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                  title="Delete Goal"
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

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <span className="text-xs font-bold text-[#64748B] animate-pulse">Loading details...</span>
            </div>
          ) : !goal ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <span className="text-sm font-bold text-[#0F172A]">Goal not found</span>
              <button onClick={handleClose} className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold">
                Close Modal
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: DETAILS */}
              {activeTab === 'details' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Pastel Banner Header */}
                  <div
                    style={{ backgroundColor: goal.cardColor || '#FBBF24' }}
                    className="p-6 rounded-3xl border border-black/5 text-[#0F172A] space-y-3 shadow-sm"
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
                      <p className="text-xs font-semibold text-[#0F172A]/85 leading-relaxed">
                        {goal.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Progress</span>
                        <span>{goal.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#0F172A] h-full rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tasks Section */}
                  <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-4 shadow-xs">
                    <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-[#22D3EE]" />
                      <span>Action Tasks ({goal.tasks?.length || 0})</span>
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

                    <form onSubmit={handleAddTask} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add sub-task..."
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
                </div>
              )}

              {/* TAB 2: WORK MAP & FLOW */}
              {activeTab === 'map' && (
                <div className="h-full flex gap-4 min-h-[450px]">
                  {/* Left Control Palette */}
                  <div className="w-64 bg-slate-50 border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between space-y-4 flex-shrink-0">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-[#0F172A]">Mind Map Controls</h4>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="New node label..."
                          value={newNodeLabel}
                          onChange={(e) => setNewNodeLabel(e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-medium"
                        />
                        <div className="flex items-center justify-between">
                          {PASTEL_COLORS.map((c) => (
                            <button
                              key={c.hex}
                              onClick={() => setSelectedNodeColor(c.hex)}
                              style={{ backgroundColor: c.hex }}
                              className={`w-5 h-5 rounded-full border-2 ${selectedNodeColor === c.hex ? 'border-[#0F172A] scale-110' : 'border-transparent'}`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={handleAddNode}
                          className="w-full py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Node</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveMap}
                      className="w-full py-2 bg-[#22D3EE] text-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved Flow!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Work Map</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* React Flow Canvas */}
                  <div className="flex-1 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden relative">
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      fitView
                    >
                      <Controls className="bg-white border border-[#E2E8F0] rounded-xl shadow-md p-1" />
                      <MiniMap nodeColor={() => '#22D3EE'} className="rounded-xl border border-[#E2E8F0]" />
                      <Background color="#E2E8F0" gap={16} size={1} />
                    </ReactFlow>
                  </div>
                </div>
              )}

              {/* TAB 3: ROADMAP */}
              {activeTab === 'roadmap' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-[#E2E8F0] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                      <h3 className="font-bold text-xs text-[#0F172A] flex items-center gap-2">
                        <CalendarRange className="w-4 h-4 text-[#C084FC]" />
                        <span>{currentYear} Execution Horizon Timeline</span>
                      </h3>
                      <span className="text-[11px] font-bold text-[#64748B]">Goal Context View</span>
                    </div>

                    {/* Months Header */}
                    <div className="grid grid-cols-12 gap-1 text-center text-[10px] font-extrabold text-[#64748B]">
                      {months.map((m) => (
                        <div key={m} className="bg-white py-1 rounded-md border border-[#E2E8F0]">{m}</div>
                      ))}
                    </div>

                    {/* All Goals Timeline */}
                    <div className="space-y-3 pt-2">
                      {goals.map((g, idx) => {
                        const isCurrent = g._id === goal._id;
                        const spanCol = (idx % 4) * 3 + 1;
                        const spanWidth = 4 + (idx % 3);

                        return (
                          <div key={g._id} className={`space-y-1 p-2 rounded-xl border ${isCurrent ? 'bg-white border-[#0F172A] shadow-xs' : 'bg-white/50 border-[#E2E8F0]'}`}>
                            <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                              <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.cardColor }} />
                                {g.title} {isCurrent && <span className="text-[10px] bg-[#0F172A] text-white px-1.5 py-0.5 rounded-md">Focused</span>}
                              </span>
                              <span className="text-[11px] text-[#64748B]">{g.progress || 0}%</span>
                            </div>

                            <div className="grid grid-cols-12 gap-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
                              <div
                                style={{ 
                                  gridColumnStart: spanCol, 
                                  gridColumnEnd: `span ${Math.min(spanWidth, 12 - spanCol + 1)}`,
                                  backgroundColor: g.cardColor || '#FBBF24'
                                }}
                                className="py-1.5 px-3 rounded-md text-[#0F172A] font-bold text-[11px] flex items-center justify-between truncate border border-black/5"
                              >
                                <span className="truncate">{g.category}</span>
                                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;
