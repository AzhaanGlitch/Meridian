import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, PASTEL_COLORS, getContrastingTextColor } from '../context/AppContext';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import ReactFlow, { 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge, 
  MiniMap,
  Handle,
  Position
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
  Check,
  Download,
  FileDown,
  Star
} from 'lucide-react';

// Custom Flowchart Node with 1, 2, 3 or 4 customizable connection points (Handles)
const CustomFlowchartNode = ({ data, selected }) => {
  const points = data?.connectionPoints || 4;
  const label = data?.label || 'Node';
  const color = data?.color || '#22D3EE';
  const textColor = getContrastingTextColor(color);

  return (
    <div
      style={{
        backgroundColor: color,
        color: textColor,
        borderRadius: '24px',
        padding: '12px 24px',
        border: selected ? (textColor === '#F8FAFC' ? '2px solid #FFFFFF' : '2px solid #0F172A') : '1px solid rgba(0,0,0,0.08)',
        boxShadow: selected ? '0 6px 18px rgba(0,0,0,0.14)' : '0 3px 10px rgba(0,0,0,0.06)'
      }}
      className="relative text-xs font-bold text-center min-w-[130px] select-none"
    >
      {/* Connection Point 1: Top */}
      {points >= 1 && (
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="!w-1.5 !h-1.5 !min-w-[6px] !min-h-[6px] !bg-[#0F172A] !border !border-white !rounded-full -top-1 transition-transform hover:scale-150"
        />
      )}

      {/* Connection Point 2: Bottom */}
      {points >= 2 && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="!w-1.5 !h-1.5 !min-w-[6px] !min-h-[6px] !bg-[#0F172A] !border !border-white !rounded-full -bottom-1 transition-transform hover:scale-150"
        />
      )}

      {/* Connection Point 3: Left */}
      {points >= 3 && (
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="!w-1.5 !h-1.5 !min-w-[6px] !min-h-[6px] !bg-[#0F172A] !border !border-white !rounded-full -left-1 transition-transform hover:scale-150"
        />
      )}

      {/* Connection Point 4: Right */}
      {points >= 4 && (
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="!w-1.5 !h-1.5 !min-w-[6px] !min-h-[6px] !bg-[#0F172A] !border !border-white !rounded-full -right-1 transition-transform hover:scale-150"
        />
      )}
      {/* Importance Stars Badge (1 or 2 stars) */}
      {Number(data?.importance) > 0 && (
        <div className="absolute -top-3 right-2 flex items-center gap-0.5 bg-[#0F172A] px-2 py-0.5 rounded-full shadow-md z-20 border border-white/20">
          {Array.from({ length: Math.min(Number(data.importance), 2) }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-[#FDE047] text-[#FDE047]" />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 leading-snug">
        <span>{label}</span>
      </div>
    </div>
  );
};

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
  const [connectionPoints, setConnectionPoints] = useState(4);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exportingFormat, setExportingFormat] = useState(null); // 'jpg' | 'pdf' | null

  // Selected Node State for Editing in Left Panel
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [editNodeLabel, setEditNodeLabel] = useState('');
  const [editNodeColor, setEditNodeColor] = useState('#22D3EE');
  const [editNodePoints, setEditNodePoints] = useState(4);
  const [editNodeImportance, setEditNodeImportance] = useState(0); // 0 | 1 | 2 stars

  // Undo / History Stack for Ctrl + Z
  const historyRef = useRef([]);
  const isUndoingRef = useRef(false);

  const flowchartWrapperRef = useRef(null);

  const nodeTypes = useMemo(() => ({
    customFlowNode: CustomFlowchartNode
  }), []);

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
  }, [id]);

  useEffect(() => {
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
        type: 'customFlowNode',
        data: { 
          label: targetGoal.title, 
          color: '#0F172A',
          importance: targetGoal.importance || 0,
          connectionPoints: 4
        },
        position: { x: 280, y: 40 }
      };
      const childNodes = children.map((c, idx) => ({
        id: `child-${c._id}`,
        type: 'customFlowNode',
        data: { 
          label: c.title,
          color: c.cardColor || '#FBBF24',
          importance: c.importance || 0,
          connectionPoints: 4
        },
        position: { x: 80 + (idx % 3) * 220, y: 180 + Math.floor(idx / 3) * 110 }
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
          type: 'customFlowNode',
          data: { 
            label: targetGoal.title,
            color: targetGoal.cardColor || '#22D3EE',
            importance: targetGoal.importance || 0,
            connectionPoints: 4
          },
          position: { x: 280, y: 40 }
        },
        ...(targetGoal.tasks || []).map((t, idx) => ({
          id: `task-node-${idx}`,
          type: 'customFlowNode',
          data: { 
            label: t.title,
            color: '#F1F5F9',
            importance: t.importance || 0,
            connectionPoints: 4
          },
          position: { x: 100 + (idx % 3) * 200, y: 180 + Math.floor(idx / 3) * 100 }
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

  // Push state snapshot before changes
  const pushSnapshot = useCallback(() => {
    if (isUndoingRef.current) return;
    historyRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    });
    // Limit history stack size to 50
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
    }
  }, [nodes, edges]);

  // Undo function to restore previous snapshot
  const handleUndo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const lastSnapshot = historyRef.current.pop();
    if (lastSnapshot) {
      isUndoingRef.current = true;
      setNodes(lastSnapshot.nodes);
      setEdges(lastSnapshot.edges);
      setSelectedNodeId(null);
      setTimeout(() => {
        isUndoingRef.current = false;
      }, 50);
    }
  }, []);

  // Listen for Ctrl+Z or Cmd+Z globally when flowchart is active
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo]);

  const onConnect = useCallback(
    (params) => {
      pushSnapshot();
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#0F172A', strokeWidth: 2 } }, eds));
    },
    [pushSnapshot]
  );

  // Delete edge/connection on a single click
  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    pushSnapshot();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, [pushSnapshot]);

  // When a node is clicked, populate the edit panel
  const onNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    setSelectedNodeId(node.id);
    setEditNodeLabel(node.data?.label || '');
    setEditNodeColor(node.data?.color || node.style?.background || '#22D3EE');
    setEditNodePoints(node.data?.connectionPoints || 4);
    setEditNodeImportance(node.data?.importance || 0);
  }, []);

  // Clicking on background deselects node
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Save changes to the selected node
  const handleUpdateSelectedNode = () => {
    if (!selectedNodeId) return;
    pushSnapshot();
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNodeId) {
          const { style, ...rest } = n;
          return {
            ...rest,
            type: 'customFlowNode',
            data: {
              ...n.data,
              label: editNodeLabel.trim() || n.data?.label || 'Node',
              color: editNodeColor,
              connectionPoints: Number(editNodePoints) || 4,
              importance: Number(editNodeImportance) || 0
            }
          };
        }
        return n;
      })
    );
  };

  // Delete the selected node and its connected edges
  const handleDeleteSelectedNode = () => {
    if (!selectedNodeId) return;
    pushSnapshot();
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  };

  const handleAddCustomNode = () => {
    if (!newNodeLabel.trim()) return;
    pushSnapshot();
    const newNode = {
      id: `custom-${Date.now()}`,
      type: 'customFlowNode',
      data: { 
        label: newNodeLabel.trim(),
        connectionPoints: Number(connectionPoints) || 4,
        color: selectedNodeColor
      },
      position: { x: 200 + Math.random() * 80, y: 180 + Math.random() * 80 }
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

  // Download Flowchart as JPG or PDF
  const handleDownloadFlowchart = async (format) => {
    if (!flowchartWrapperRef.current) return;
    setExportingFormat(format);
    try {
      // Find the reactflow viewport container or wrapper
      const element = flowchartWrapperRef.current;
      const dataUrl = await toJpeg(element, {
        backgroundColor: '#ffffff',
        quality: 0.95,
        filter: (node) => {
          // Exclude controls, minimap, and connecting points (handles) from download
          if (node.classList) {
            if (
              node.classList.contains('react-flow__controls') ||
              node.classList.contains('react-flow__minimap') ||
              node.classList.contains('react-flow__handle')
            ) {
              return false;
            }
          }
          return true;
        }
      });

      const filename = `${(activeFocusedGoal?.title || 'flowchart').replace(/\s+/g, '_').toLowerCase()}`;

      if (format === 'jpg') {
        const link = document.createElement('a');
        link.download = `${filename}.jpg`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [element.offsetWidth, element.offsetHeight]
        });
        pdf.addImage(dataUrl, 'JPEG', 0, 0, element.offsetWidth, element.offsetHeight);
        pdf.save(`${filename}.pdf`);
      }
    } catch (err) {
      console.error('Failed to export flowchart', err);
      alert('Unable to export flowchart. Please try again.');
    } finally {
      setExportingFormat(null);
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
                  <div className="w-64 bg-slate-50 border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between space-y-4 flex-shrink-0">
                    {/* Node Controls: Edit Mode when node is selected, otherwise Add New Node */}
                    {selectedNodeId ? (
                      <div className="space-y-3 bg-white p-3 rounded-2xl border border-[#0F172A] shadow-xs">
                        <div className="flex items-center justify-between pb-1 border-b border-[#E2E8F0]">
                          <span className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1.5">
                            <Edit2 className="w-3.5 h-3.5 text-[#22D3EE]" />
                            <span>Edit Selected Node</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedNodeId(null)}
                            className="text-[#64748B] hover:text-[#0F172A] text-xs font-bold"
                            title="Cancel editing"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Edit Label */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] block">Node Text</label>
                          <input
                            type="text"
                            value={editNodeLabel}
                            onChange={(e) => setEditNodeLabel(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0F172A]"
                          />
                        </div>

                        {/* Importance Stars: 0, 1, or 2 stars */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] block">Importance</label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditNodeImportance(0)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${editNodeImportance === 0 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}
                            >
                              None
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditNodeImportance(1)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${editNodeImportance === 1 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}
                              title="1 Star: Important"
                            >
                              <Star className="w-3 h-3 fill-[#FDE047] text-[#FDE047]" />
                              <span>Important</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditNodeImportance(2)}
                              className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold border ${editNodeImportance === 2 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}
                              title="2 Stars: Very Important"
                            >
                              <Star className="w-3 h-3 fill-[#FDE047] text-[#FDE047]" />
                              <Star className="w-3 h-3 fill-[#FDE047] text-[#FDE047]" />
                            </button>
                          </div>
                        </div>

                        {/* Connecting Points */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] block">Connecting Points</label>
                          <div className="grid grid-cols-4 gap-1">
                            {[1, 2, 3, 4].map((pt) => (
                              <button
                                key={pt}
                                type="button"
                                onClick={() => setEditNodePoints(pt)}
                                className={`py-1 rounded-lg text-[10px] font-bold border ${editNodePoints === pt ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}
                              >
                                {pt} pt{pt > 1 ? 's' : ''}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Color Selector */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] block">Color</label>
                          <div className="grid grid-cols-6 gap-1.5 bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
                            {PASTEL_COLORS.slice(0, 12).map((c) => (
                              <button
                                key={c.hex}
                                type="button"
                                onClick={() => setEditNodeColor(c.hex)}
                                style={{ backgroundColor: c.hex }}
                                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                                  editNodeColor === c.hex ? 'border-[#0F172A] scale-110 shadow-xs' : 'border-black/10'
                                }`}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Apply & Delete Node Buttons */}
                        <div className="pt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={handleUpdateSelectedNode}
                            className="flex-1 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                          >
                            Apply Changes
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteSelectedNode}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-all active:scale-95 cursor-pointer"
                            title="Delete Node"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-[#0F172A] block">Add Custom Node</span>
                        <input
                          type="text"
                          placeholder="Node text..."
                          value={newNodeLabel}
                          onChange={(e) => setNewNodeLabel(e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#0F172A]"
                        />

                        {/* Connection Points Selector (1, 2, 3, 4) */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-[#64748B] block">Connecting Points:</span>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[1, 2, 3, 4].map((pt) => (
                              <button
                                key={pt}
                                type="button"
                                onClick={() => setConnectionPoints(pt)}
                                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  connectionPoints === pt
                                    ? 'bg-[#0F172A] text-white shadow-xs scale-[1.02]'
                                    : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
                                }`}
                              >
                                {pt} pt{pt > 1 ? 's' : ''}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Circular Color Palette of Minimal Soft Colors */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-[#64748B] block">Node Color:</span>
                          <div className="grid grid-cols-6 gap-2 bg-white p-2.5 rounded-2xl border border-[#E2E8F0]">
                            {PASTEL_COLORS.slice(0, 12).map((c) => (
                              <button
                                key={c.hex}
                                type="button"
                                onClick={() => setSelectedNodeColor(c.hex)}
                                style={{ backgroundColor: c.hex }}
                                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                                  selectedNodeColor === c.hex ? 'border-[#0F172A] scale-110 shadow-xs' : 'border-black/10'
                                }`}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleAddCustomNode}
                          className="w-full py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer mt-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Node</span>
                        </button>
                      </div>
                    )}

                    <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                      <button
                        onClick={handleSaveFlowchart}
                        className="w-full py-2 bg-[#22D3EE] hover:bg-[#06b6d4] text-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
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

                      {/* Download Buttons: JPG and PDF */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={!!exportingFormat}
                          onClick={() => handleDownloadFlowchart('jpg')}
                          className="py-1.5 bg-white hover:bg-slate-100 text-[#0F172A] border border-[#E2E8F0] rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                          title="Download Flowchart as JPG"
                        >
                          <Download className="w-3.5 h-3.5 text-[#0F172A]" />
                          <span>{exportingFormat === 'jpg' ? 'Exporting...' : 'JPG'}</span>
                        </button>
                        <button
                          type="button"
                          disabled={!!exportingFormat}
                          onClick={() => handleDownloadFlowchart('pdf')}
                          className="py-1.5 bg-white hover:bg-slate-100 text-[#0F172A] border border-[#E2E8F0] rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                          title="Download Flowchart as PDF"
                        >
                          <FileDown className="w-3.5 h-3.5 text-[#0F172A]" />
                          <span>{exportingFormat === 'pdf' ? 'Exporting...' : 'PDF'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* React Flow Canvas */}
                  <div 
                    ref={flowchartWrapperRef}
                    className="flex-1 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden relative"
                  >
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      nodeTypes={nodeTypes}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      onEdgeClick={onEdgeClick}
                      onNodeClick={onNodeClick}
                      onPaneClick={onPaneClick}
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
                  {selectedNodeId ? (
                    <div className="space-y-3 bg-white p-3 rounded-2xl border border-[#0F172A] shadow-xs">
                      <div className="flex items-center justify-between pb-1 border-b border-[#E2E8F0]">
                        <span className="text-xs font-extrabold text-[#0F172A] flex items-center gap-1.5">
                          <Edit2 className="w-3.5 h-3.5 text-[#22D3EE]" />
                          <span>Edit Selected Node</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedNodeId(null)}
                          className="text-[#64748B] hover:text-[#0F172A] text-xs font-bold"
                          title="Cancel editing"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit Label */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#64748B] block">Node Text</label>
                        <input
                          type="text"
                          value={editNodeLabel}
                          onChange={(e) => setEditNodeLabel(e.target.value)}
                          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0F172A]"
                        />
                      </div>

                      {/* Importance Stars: 0, 1, or 2 stars */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#64748B] block">Importance</label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditNodeImportance(0)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${editNodeImportance === 0 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}
                          >
                            None
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditNodeImportance(1)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${editNodeImportance === 1 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}
                            title="1 Star: Important"
                          >
                            <Star className="w-3 h-3 fill-[#FDE047] text-[#FDE047]" />
                            <span>Important</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditNodeImportance(2)}
                            className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold border ${editNodeImportance === 2 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}
                            title="2 Stars: Very Important"
                          >
                            <Star className="w-3 h-3 fill-[#FDE047] text-[#FDE047]" />
                            <Star className="w-3 h-3 fill-[#FDE047] text-[#FDE047]" />
                          </button>
                        </div>
                      </div>

                      {/* Connecting Points */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#64748B] block">Connecting Points</label>
                        <div className="grid grid-cols-4 gap-1">
                          {[1, 2, 3, 4].map((pt) => (
                            <button
                              key={pt}
                              type="button"
                              onClick={() => setEditNodePoints(pt)}
                              className={`py-1 rounded-lg text-[10px] font-bold border ${editNodePoints === pt ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}
                            >
                              {pt} pt{pt > 1 ? 's' : ''}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Selector */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#64748B] block">Color</label>
                        <div className="grid grid-cols-6 gap-1.5 bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
                          {PASTEL_COLORS.slice(0, 12).map((c) => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => setEditNodeColor(c.hex)}
                              style={{ backgroundColor: c.hex }}
                              className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                                editNodeColor === c.hex ? 'border-[#0F172A] scale-110 shadow-xs' : 'border-black/10'
                              }`}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Apply & Delete Node Buttons */}
                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={handleUpdateSelectedNode}
                          className="flex-1 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          Apply Changes
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteSelectedNode}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-all active:scale-95 cursor-pointer"
                          title="Delete Node"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
                      <span className="text-xs font-bold text-[#0F172A] block">Add Custom Note/Node</span>
                      <input
                        type="text"
                        placeholder="Node title/notes..."
                        value={newNodeLabel}
                        onChange={(e) => setNewNodeLabel(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#0F172A]"
                      />

                      {/* Connecting Points Option: 1, 2, 3, or 4 */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-[#64748B] block">Connecting Points:</span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[1, 2, 3, 4].map((pt) => (
                            <button
                              key={pt}
                              type="button"
                              onClick={() => setConnectionPoints(pt)}
                              className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                connectionPoints === pt
                                  ? 'bg-[#0F172A] text-white shadow-xs scale-[1.02]'
                                  : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
                              }`}
                            >
                              {pt} pt{pt > 1 ? 's' : ''}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Circular Color Palette of Minimal Soft Colors */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-[#64748B] block">Node Color:</span>
                        <div className="grid grid-cols-6 gap-2 bg-white p-2.5 rounded-2xl border border-[#E2E8F0]">
                          {PASTEL_COLORS.slice(0, 12).map((c) => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => setSelectedNodeColor(c.hex)}
                              style={{ backgroundColor: c.hex }}
                              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                                selectedNodeColor === c.hex ? 'border-[#0F172A] scale-110 shadow-xs' : 'border-black/10'
                              }`}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleAddCustomNode}
                        className="w-full py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Node to Flowchart</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                  <button
                    onClick={handleSaveFlowchart}
                    className="w-full py-2 bg-[#22D3EE] hover:bg-[#06b6d4] text-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
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

                  {/* Download Buttons: JPG and PDF */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={!!exportingFormat}
                      onClick={() => handleDownloadFlowchart('jpg')}
                      className="py-1.5 bg-white hover:bg-slate-100 text-[#0F172A] border border-[#E2E8F0] rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      title="Download Flowchart as JPG"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0F172A]" />
                      <span>{exportingFormat === 'jpg' ? 'Exporting...' : 'JPG'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={!!exportingFormat}
                      onClick={() => handleDownloadFlowchart('pdf')}
                      className="py-1.5 bg-white hover:bg-slate-100 text-[#0F172A] border border-[#E2E8F0] rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      title="Download Flowchart as PDF"
                    >
                      <FileDown className="w-3.5 h-3.5 text-[#0F172A]" />
                      <span>{exportingFormat === 'pdf' ? 'Exporting...' : 'PDF'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setParentView('cards')}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-[#0F172A] border border-[#E2E8F0] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Back to Child Cards
                  </button>
                </div>
              </div>

              {/* React Flow Interactive Canvas */}
              <div 
                ref={flowchartWrapperRef}
                className="flex-1 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden relative"
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onEdgeClick={onEdgeClick}
                  onNodeClick={onNodeClick}
                  onPaneClick={onPaneClick}
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
                    {childGoals.map((cg) => {
                      const cgTextColor = getContrastingTextColor(cg.cardColor);
                      const isDark = cgTextColor === '#F8FAFC';
                      return (
                        <div
                          key={cg._id}
                          onClick={() => setSelectedChildId(cg._id)}
                          style={{ backgroundColor: cg.cardColor || '#FBBF24', color: cgTextColor }}
                          className="h-44 p-6 rounded-3xl border border-black/5 cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200 flex flex-col justify-start select-none shadow-sm"
                        >
                          <h4 
                            style={{ color: cgTextColor }}
                            className="font-extrabold text-lg leading-snug mb-2 line-clamp-2"
                          >
                            {cg.title}
                          </h4>
                          {cg.description && (
                            <p 
                              style={{ color: cgTextColor, opacity: isDark ? 0.9 : 0.85 }}
                              className="text-xs line-clamp-4 font-medium leading-relaxed"
                            >
                              {cg.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
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
