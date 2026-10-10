import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useApp, PASTEL_COLORS } from '../context/AppContext';
import { 
  Plus, 
  Save, 
  Trash2, 
  Check
} from 'lucide-react';

const Maps = () => {
  const { maps, createMap, updateMap, deleteMap } = useApp();

  const [activeMapId, setActiveMapId] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mapTitle, setMapTitle] = useState('New Work Map');
  const [mapType, setMapType] = useState('mindmap');
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [selectedNodeColor, setSelectedNodeColor] = useState('#22D3EE');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize canvas with first map or create default template
  useEffect(() => {
    if (maps.length > 0 && !activeMapId) {
      loadMap(maps[0]);
    } else if (maps.length === 0) {
      loadDefaultTemplate();
    }
  }, [maps]);

  const loadMap = (mapObj) => {
    setActiveMapId(mapObj._id);
    setMapTitle(mapObj.title);
    setMapType(mapObj.type || 'mindmap');
    setNodes(mapObj.nodes || []);
    setEdges(mapObj.edges || []);
  };

  const loadDefaultTemplate = () => {
    setActiveMapId(null);
    setMapTitle('SaaS Launch Roadmap Mind Map');
    setMapType('mindmap');
    setNodes([
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
    ]);
    setEdges([
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#0F172A', strokeWidth: 2 } },
      { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#0F172A', strokeWidth: 2 } },
      { id: 'e3-4', source: '3', target: '4', style: { stroke: '#0F172A', strokeWidth: 2 } },
      { id: 'e2-5', source: '2', target: '5', style: { stroke: '#0F172A', strokeWidth: 2 } }
    ]);
  };

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
      position: { x: 250 + Math.random() * 50, y: 250 + Math.random() * 50 },
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
    const payload = {
      title: mapTitle,
      type: mapType,
      nodes,
      edges,
      cardColor: selectedNodeColor
    };

    if (activeMapId) {
      await updateMap(activeMapId, payload);
    } else {
      const res = await createMap(payload);
      if (res.success) {
        setActiveMapId(res.data._id);
      }
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDeleteMap = async () => {
    if (activeMapId && confirm('Delete this map canvas?')) {
      await deleteMap(activeMapId);
      loadDefaultTemplate();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white min-h-full pb-8 h-full">
      <main className="flex-1 flex px-8 py-6 gap-6 min-h-0 h-full">
        {/* Left Toolbar & Saved Maps Drawer */}
        <div className="w-72 bg-white rounded-2xl border border-[#E2E8F0] p-4 soft-shadow flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Map Title</label>
              <input
                type="text"
                value={mapTitle}
                onChange={(e) => setMapTitle(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-bold text-[#0F172A]"
              />
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Diagram Type</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  onClick={() => setMapType('mindmap')}
                  className={`py-1.5 rounded-xl border ${mapType === 'mindmap' ? 'bg-[#0F172A] text-[#22D3EE] border-[#0F172A]' : 'bg-[#F1F5F9] text-[#64748B]'}`}
                >
                  Mind Map
                </button>
                <button
                  onClick={() => setMapType('flowchart')}
                  className={`py-1.5 rounded-xl border ${mapType === 'flowchart' ? 'bg-[#0F172A] text-[#22D3EE] border-[#0F172A]' : 'bg-[#F1F5F9] text-[#64748B]'}`}
                >
                  Flowchart
                </button>
              </div>
            </div>

            {/* Add Node Tool */}
            <div className="pt-2 border-t border-[#E2E8F0] space-y-3">
              <span className="text-xs font-bold text-[#0F172A] block">Add Custom Node</span>
              <input
                type="text"
                placeholder="Node label..."
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium"
              />

              {/* Node Color picker */}
              <div className="flex items-center justify-between gap-1">
                {PASTEL_COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedNodeColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full border-2 ${selectedNodeColor === c.hex ? 'border-[#0F172A] scale-110' : 'border-transparent'}`}
                  />
                ))}
              </div>

              <button
                onClick={handleAddNode}
                className="w-full py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-[#E2E8F0]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Node to Canvas</span>
              </button>
            </div>

            {/* Saved Canvas List */}
            <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
                <span>Saved Maps</span>
                <button onClick={loadDefaultTemplate} className="text-[#0F172A] underline text-[10px]">
                  + New Blank
                </button>
              </div>

              <div className="space-y-1 max-h-40 overflow-y-auto">
                {maps.map(m => (
                  <button
                    key={m._id}
                    onClick={() => loadMap(m)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold truncate transition-colors ${
                      activeMapId === m._id ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] hover:bg-slate-200 text-[#0F172A]'
                    }`}
                  >
                    {m.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <button
              onClick={handleSaveMap}
              className="w-full py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-[#86EFAC]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Map Canvas</span>
                </>
              )}
            </button>

            {activeMapId && (
              <button
                onClick={handleDeleteMap}
                className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Map</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Interactive React Flow Canvas */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden soft-shadow relative min-h-[500px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls className="bg-white border border-[#E2E8F0] rounded-xl shadow-md p-1" />
            <MiniMap nodeColor={() => '#22D3EE'} className="rounded-xl border border-[#E2E8F0] shadow-md" />
            <Background color="#E2E8F0" gap={16} size={1} />
          </ReactFlow>
        </div>
      </main>
    </div>
  );
};

export default Maps;
