import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, PASTEL_COLORS } from '../context/AppContext';
import ReactFlow, { 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge, 
  MiniMap 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  X, 
  Edit2, 
  Trash2, 
  Plus, 
  ArrowLeft,
  GitFork,
  CheckSquare,
  CalendarRange,
  ChevronRight,
  Save,
  Check
} from 'lucide-react';

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteGoal, updateGoal, setEditingGoal, setIsGoalModalOpen, setParentGoalContext, goals, getGoalById } = useApp();

  const [goal, setGoal] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [loading, setLoading] = useState(true);

  // View state for parent card: 'cards' or 'flowchart'
  const [parentView, setParentView] = useState('cards');

  // Tabs for child card: 'checklist', 'flowchart', 'roadmap'
  const [childActiveTab, setChildActiveTab] = useState('checklist');
  const [newChecklistTask, setNewChecklistTask] = useState('');

  // React Flow state for flowchart view (Parent or Child)
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [selectedNodeColor, setSelectedNodeColor] = useState('#22D3EE');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Find child goals for the current parent goal
  const childGoals = goals.filter(g => g.parentGoal === id);

  // Active focused goal (either parent or selected child)
  const activeFocusedGoal = selectedChildId 
    ? goals.find(g => g._id === selectedChildId) || goal 
    : goal;

  useEffect(() => {
    setSelectedChildId(null);
    setParentView('cards');
    setChildActiveTab('checklist');
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

  // Synchronize React Flow nodes when switching into flowchart view
  const setupFlowchart = useCallback((targetGoal, isParentFlowchart = false) => {
    if (!targetGoal) return;
    if (targetGoal.nodes && targetGoal.nodes.length > 0) {
      setNodes(targetGoal.nodes);
      setEdges(targetGoal.edges || []);
    } else if (isParentFlowchart) {
      // Connect parent root card to all child cards in flowchart
      const children = goals.filter(g => g.parentGoal === targetGoal._id);
      const rootNode = {
        id: `parent-${targetGoal._id}`,
        type: 'input',
        data: { label: targetGoal.title },
        position: { x: 280, y: 40 },
        style: { 
          background: '#0F172A', 
          color: '#ffffff', 
          borderRadius: '16px', 
          padding: '14px 24px', 
          fontWeight: 'bold',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }
      };
      const childNodes = children.map((c, idx) => ({
        id: `child-${c._id}`,
        data: { label: c.title },
        position: { x: 80 + (idx % 3) * 220, y: 180 + Math.floor(idx / 3) * 110 },
        style: { 
          background: c.cardColor || '#FBBF24', 
          color: '#0F172A', 
          borderRadius: '16px', 
          padding: '12px 20px', 
          border: '1px solid rgba(0,0,0,0.06)', 
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }
      }));
      const childEdges = children.map(c => ({
        id: `e-${targetGoal._id}-${c._id}`,
        source: `parent-${targetGoal._id}`,
        target: `child-${c._id}`,
        animated: true,
        style: { stroke: '#0F172A', strokeWidth: 2 }
      }));
      setNodes([rootNode, ...childNodes]);
      setEdges(childEdges);
    } else {
      // Child flowchart default template
      setNodes([
        {
          id: `child-root-${targetGoal._id}`,
          type: 'input',
          data: { label: targetGoal.title },
          position: { x: 280, y: 40 },
          style: { 
            background: targetGoal.cardColor || '#22D3EE', 
            color: '#0F172A', 
            borderRadius: '16px', 
            padding: '12px 22px', 
            fontWeight: 'bold',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }
        },
        ...(targetGoal.tasks || []).map((t, idx) => ({
          id: `task-node-${idx}`,
          data: { label: t.title },
          position: { x: 100 + (idx % 3) * 200, y: 180 + Math.floor(idx / 3) * 100 },
          style: { 
            background: '#F1F5F9', 
            color: '#0F172A', 
            borderRadius: '14px', 
            padding: '10px 18px', 
            border: '1px solid #E2E8F0', 
            fontWeight: '600' 
          }
        }))
      ]);
      setEdges(
        (targetGoal.tasks || []).map((_, idx) => ({
          id: `e-task-${idx}`,
          source: `child-root-${targetGoal._id}`,
          target: `task-node-${idx}`,
          animated: true,
          style: { stroke: '#0F172A', strokeWidth: 2 }
        }))
      );
    }
  }, [goals]);

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

  const handleAddCustomNode = () => {
    if (!newNodeLabel.trim()) return;
    const newNode = {
      id: `custom-${Date.now()}`,
      data: { label: newNodeLabel.trim() },
      position: { x: 200 + Math.random() * 80, y: 180 + Math.random() * 80 },
      style: { 
        background: selectedNodeColor, 
        color: '#0F172A', 
        borderRadius: '14px', 
        padding: '10px 18px', 
        border: 'none',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }
    };
    setNodes((prev) => [...prev, newNode]);
    setNewNodeLabel('');
  };

  const handleSaveFlowchart = async () => {
    const target = activeFocusedGoal;
    const res = await updateGoal(target._id, { nodes, edges });
    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  // Checklist handlers for child card
  const handleTaskToggle = async (taskIndex) => {
    const target = activeFocusedGoal;
    const updatedTasks = [...(target.tasks || [])];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
    await updateGoal(target._id, { tasks: updatedTasks });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newChecklistTask.trim()) return;
    const target = activeFocusedGoal;
    const updatedTasks = [...(target.tasks || []), { title: newChecklistTask.trim(), completed: false }];
    await updateGoal(target._id, { tasks: updatedTasks });
    setNewChecklistTask('');
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

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all animate-in fade-in duration-200">
      {/* Centered Modal Overlay Card */}
      <div 
        className="w-full max-w-5xl h-[88vh] bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
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

          {/* Action Icons Bar */}
          <div className="flex items-center gap-3">
            {goal && !selectedChildId && (
              /* Flowchart button on left side of edit, delete buttons */
              <button
                onClick={() => {
                  if (parentView === 'cards') {
                    setupFlowchart(goal, true);
                    setParentView('flowchart');
                  } else {
                    setParentView('cards');
                  }
                }}
                className={`p-1.5 transition-colors flex items-center gap-1.5 text-xs font-bold ${
                  parentView === 'flowchart' 
                    ? 'text-[#22D3EE] bg-[#0F172A] px-3 py-1 rounded-full' 
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title={parentView === 'flowchart' ? 'Switch to Cards View' : 'Open Flowchart View'}
              >
                <GitFork className="w-5 h-5" />
                <span className="hidden sm:inline">Flowchart</span>
              </button>
            )}

            {goal && (
              <>
                <button
                  onClick={() => {
                    setEditingGoal(activeFocusedGoal);
                    setIsGoalModalOpen(true);
                  }}
                  className="text-[#64748B] hover:text-[#0F172A] transition-colors p-1"
                  title="Edit Card"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-[#64748B] hover:text-red-600 transition-colors p-1"
                  title="Delete Card"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}

            <button
              onClick={handleClose}
              className="text-[#64748B] hover:text-[#0F172A] transition-colors p-1 ml-1"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col">
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <span className="text-xs font-bold text-[#64748B] animate-pulse">Loading...</span>
            </div>
          ) : !goal ? (
            <div className="h-48 flex flex-col items-center justify-center space-y-4">
              <span className="text-sm font-bold text-[#0F172A]">Card not found</span>
              <button onClick={handleClose} className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold">
                Close
              </button>
            </div>
          ) : selectedChildId ? (
            /* CHILD CARD VIEW: 3 TABS (Checklist, Flowchart, Roadmap) */
            <div className="space-y-6 max-w-4xl mx-auto w-full flex-1 flex flex-col">
              {/* Back to Parent Card Breadcrumb */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedChildId(null)}
                  className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to {goal.title}</span>
                </button>

                {/* 3 Tabs: Checklist, Flowchart, Roadmap */}
                <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-2xl border border-[#E2E8F0]">
                  <button
                    onClick={() => setChildActiveTab('checklist')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      childActiveTab === 'checklist' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Checklist</span>
                  </button>

                  <button
                    onClick={() => {
                      setupFlowchart(activeFocusedGoal, false);
                      setChildActiveTab('flowchart');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      childActiveTab === 'flowchart' ? 'bg-[#0F172A] text-[#22D3EE] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    <span>Flowchart</span>
                  </button>

                  <button
                    onClick={() => setChildActiveTab('roadmap')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      childActiveTab === 'roadmap' ? 'bg-[#0F172A] text-[#C084FC] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <CalendarRange className="w-3.5 h-3.5" />
                    <span>Roadmap</span>
                  </button>
                </div>
              </div>

              {/* Child Card Header Description */}
              <div className="space-y-1">
                {activeFocusedGoal.description ? (
                  <p className="text-sm font-medium text-[#475569] leading-relaxed">
                    {activeFocusedGoal.description}
                  </p>
                ) : (
                  <p className="text-xs italic text-[#94A3B8]">No description provided for this card.</p>
                )}
              </div>

              {/* CHILD TAB 1: CHECKLIST */}
              {childActiveTab === 'checklist' && (
                <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-[#E2E8F0] space-y-4">
                  <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#22D3EE]" />
                    <span>Milestones & Action Checklist</span>
                  </h3>

                  <div className="space-y-2">
                    {activeFocusedGoal.tasks && activeFocusedGoal.tasks.length > 0 ? (
                      activeFocusedGoal.tasks.map((task, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleTaskToggle(idx)}
                          className="p-3 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors text-xs font-semibold"
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
                      <div className="text-xs text-[#64748B] italic">No checklist tasks added yet.</div>
                    )}
                  </div>

                  <form onSubmit={handleAddTask} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add new checklist item..."
                      value={newChecklistTask}
                      onChange={(e) => setNewChecklistTask(e.target.value)}
                      className="flex-1 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0F172A] text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      Add
                    </button>
                  </form>
                </div>
              )}

              {/* CHILD TAB 2: FLOWCHART */}
              {childActiveTab === 'flowchart' && (
                <div className="flex-1 flex gap-4 min-h-[420px]">
                  {/* Left Controls: Add custom node & Save */}
                  <div className="w-60 bg-slate-50 border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between space-y-4 flex-shrink-0">
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-[#0F172A] block">Add Custom Node</span>
                      <input
                        type="text"
                        placeholder="Node text..."
                        value={newNodeLabel}
                        onChange={(e) => setNewNodeLabel(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-medium"
                      />
                      <div className="flex items-center justify-between">
                        {PASTEL_COLORS.slice(0, 6).map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setSelectedNodeColor(c.hex)}
                            style={{ backgroundColor: c.hex }}
                            className={`w-5 h-5 rounded-full border-2 ${selectedNodeColor === c.hex ? 'border-[#0F172A] scale-110' : 'border-transparent'}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={handleAddCustomNode}
                        className="w-full py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Node</span>
                      </button>
                    </div>

                    <button
                      onClick={handleSaveFlowchart}
                      className="w-full py-2 bg-[#22D3EE] text-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Flowchart</span>
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

              {/* CHILD TAB 3: ROADMAP */}
              {childActiveTab === 'roadmap' && (
                <div className="bg-slate-50 p-6 rounded-3xl border border-[#E2E8F0] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                    <h3 className="font-bold text-xs text-[#0F172A] flex items-center gap-2">
                      <CalendarRange className="w-4 h-4 text-[#C084FC]" />
                      <span>{currentYear} Execution Horizon</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-12 gap-1 text-center text-[10px] font-extrabold text-[#64748B]">
                    {months.map((m) => (
                      <div key={m} className="bg-white py-1 rounded-md border border-[#E2E8F0]">{m}</div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1 p-3 rounded-2xl bg-white border border-[#0F172A] shadow-xs">
                      <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                        <span>{activeFocusedGoal.title}</span>
                        <span className="text-[11px] text-[#64748B]">{activeFocusedGoal.progress || 0}% Complete</span>
                      </div>
                      <div className="grid grid-cols-12 gap-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
                        <div
                          style={{ 
                            gridColumnStart: 2, 
                            gridColumnEnd: 'span 6',
                            backgroundColor: activeFocusedGoal.cardColor || '#FBBF24'
                          }}
                          className="py-1.5 px-3 rounded-md text-[#0F172A] font-bold text-[11px] flex items-center justify-between truncate border border-black/5"
                        >
                          <span className="truncate">{activeFocusedGoal.title}</span>
                          <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : parentView === 'flowchart' ? (
            /* PARENT FLOWCHART VIEW */
            <div className="flex-1 flex gap-4 min-h-[480px]">
              {/* Left Toolbar to add customizable notes and save */}
              <div className="w-64 bg-slate-50 border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between space-y-4 flex-shrink-0">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#0F172A]">Flowchart Controls</h4>
                  <p className="text-[11px] text-[#64748B]">
                    Child cards are arranged below. Connect handles or create extra notes anywhere on the canvas.
                  </p>

                  <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
                    <span className="text-xs font-bold text-[#0F172A] block">Add Custom Note/Node</span>
                    <input
                      type="text"
                      placeholder="Node title/notes..."
                      value={newNodeLabel}
                      onChange={(e) => setNewNodeLabel(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-medium"
                    />

                    <div className="flex items-center justify-between">
                      {PASTEL_COLORS.slice(0, 6).map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setSelectedNodeColor(c.hex)}
                          style={{ backgroundColor: c.hex }}
                          className={`w-5 h-5 rounded-full border-2 ${selectedNodeColor === c.hex ? 'border-[#0F172A] scale-110' : 'border-transparent'}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleAddCustomNode}
                      className="w-full py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Node to Flowchart</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                  <button
                    onClick={handleSaveFlowchart}
                    className="w-full py-2 bg-[#22D3EE] text-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved Flowchart!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Flowchart</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setParentView('cards')}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-[#0F172A] border border-[#E2E8F0] rounded-xl text-xs font-bold"
                  >
                    Back to Child Cards
                  </button>
                </div>
              </div>

              {/* React Flow Interactive Canvas */}
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
          ) : (
            /* PARENT CARDS VIEW: Clean Description & Curved Rectangular Child Cards Grid */
            <div className="space-y-6 max-w-4xl mx-auto w-full">
              {/* Direct Description Display without colored background box or labels */}
              <div className="space-y-1">
                {activeFocusedGoal.description ? (
                  <p className="text-sm font-medium text-[#475569] leading-relaxed">
                    {activeFocusedGoal.description}
                  </p>
                ) : (
                  <p className="text-xs italic text-[#94A3B8]">No description provided for this card.</p>
                )}
              </div>

              {/* Child Cards Grid beneath description - Curved rectangular cards with Title & Description only */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      setParentGoalContext(goal._id);
                      setEditingGoal(null);
                      setIsGoalModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                    title="Add Child Card"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {childGoals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {childGoals.map((cg) => (
                      <div
                        key={cg._id}
                        onClick={() => setSelectedChildId(cg._id)}
                        style={{ backgroundColor: cg.cardColor || '#FBBF24' }}
                        className="h-44 p-6 rounded-3xl border border-black/5 text-[#0F172A] cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200 flex flex-col justify-start select-none shadow-sm"
                      >
                        <h4 className="font-extrabold text-lg leading-snug mb-2 line-clamp-2">
                          {cg.title}
                        </h4>
                        {cg.description && (
                          <p className="text-xs text-[#0F172A]/85 line-clamp-4 font-medium leading-relaxed">
                            {cg.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#64748B] italic py-8 text-center bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                    No child cards created yet. Click "+" above to add your first child card.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;
