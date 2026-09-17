import React, { useState, useRef } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Play,
  Square,
  CheckCircle2,
  Save,
  Plus,
  Activity,
  Check,
} from 'lucide-react';
import { WorkflowNode } from '../../types';

export const WorkflowView: React.FC = () => {
  const {
    workflowNodes,
    workflowConnections,
    selectedWorkflowNodeId,
    setSelectedWorkflowNodeId,
    addWorkflowNode,
    updateWorkflowNodePos,
    runWorkflow,
    stopWorkflow,
    isWorkflowRunning,
    runValidation,
    addNotification,
  } = useWatson();

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const nodeTypes: { type: WorkflowNode['type']; label: string; desc: string }[] = [
    { type: 'Input', label: 'Nó de Entrada', desc: 'Gatilho ou fonte de dados' },
    { type: 'File', label: 'Nó de Arquivo', desc: 'Carrega config ou payload' },
    { type: 'Template', label: 'Nó de Template', desc: 'Injeta HTML de conscientização' },
    { type: 'Validator', label: 'Nó Validador', desc: 'Aplica regras e lint de segurança' },
    { type: 'Builder', label: 'Nó de Build', desc: 'Compilação e hash SHA-256' },
    { type: 'Analyzer', label: 'Nó Analisador', desc: 'Varredura AST & entropia' },
    { type: 'Output', label: 'Nó de Saída', desc: 'Deploy seguro no lab sandbox' },
  ];

  const handleMouseDown = (e: React.MouseEvent, node: WorkflowNode) => {
    e.stopPropagation();
    setSelectedWorkflowNodeId(node.id);
    setDraggingNodeId(node.id);
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      setDragOffset({
        x: e.clientX - canvasRect.left - node.x,
        y: e.clientY - canvasRect.top - node.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;
    updateWorkflowNodePos(draggingNodeId, newX, newY);
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const selectedNode = workflowNodes.find((n) => n.id === selectedWorkflowNodeId);

  return (
    <div
      className="flex-1 flex flex-col h-full watson-grid-bg bg-black overflow-hidden font-sans text-zinc-300 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Controls Bar */}
      <div className="h-14 px-6 border-b border-[#18202f] bg-[#090c13] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-wide font-mono text-xs uppercase">PIPELINE DE WORKFLOW VISUAL</span>
          </div>

          <div className="flex items-center gap-2 ml-2 font-mono">
            {isWorkflowRunning ? (
              <button
                onClick={stopWorkflow}
                className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 transition-all text-xs shadow-md"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>PARAR</span>
              </button>
            ) : (
              <button
                onClick={runWorkflow}
                className="px-4 py-1.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold flex items-center gap-1.5 transition-all text-xs shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              >
                <Play className="w-3 h-3 fill-black" />
                <span>EXECUTAR WORKFLOW</span>
              </button>
            )}

            <button
              onClick={runValidation}
              className="px-3.5 py-1.5 rounded-full bg-[#111724] hover:bg-[#1a2336] text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5 transition-colors text-xs"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>VALIDAR</span>
            </button>

            <button
              onClick={() => addNotification('Workflow Salvo', 'Grafo de nós registrado no manifesto do projeto.', 'success')}
              className="px-3.5 py-1.5 rounded-full bg-[#111724] hover:bg-[#1a2336] text-zinc-300 border border-[#1e2738] flex items-center gap-1.5 transition-colors text-xs"
            >
              <Save className="w-3 h-3 text-cyan-400" />
              <span>SALVAR</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Grafo Validado (6 Nós, 5 Ligações)</span>
        </div>
      </div>

      {/* Main Area: Sidebar + Canvas + Node Inspector */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT: Node Types Palette */}
        <div className="w-64 bg-[#080b12] border-r border-[#18202f] flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-[#18202f] bg-[#0c1018]">
            <span className="font-bold text-xs text-white tracking-wide font-mono uppercase">PALETA DE COMPONENTES</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {nodeTypes.map((item) => (
              <button
                key={item.type}
                onClick={() => addWorkflowNode(item.type)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0e131d] hover:bg-[#151c2a] border border-[#1a2232] hover:border-amber-500/40 text-left transition-all group"
              >
                <div>
                  <div className="font-semibold text-white group-hover:text-amber-300 text-xs">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-zinc-500">{item.desc}</div>
                </div>
                <Plus className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-[#18202f] bg-[#0c1018] text-[11px] text-zinc-500 font-sans">
            Arraste os nós no canvas para estruturar a pipeline de execução.
          </div>
        </div>

        {/* CENTER: Interactive SVG + HTML Graph Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 bg-[#05070c] relative overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle, #1a2232 1px, transparent 1px), radial-gradient(circle, #101622 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
          onClick={() => setSelectedWorkflowNodeId(null)}
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {workflowConnections.map((conn) => {
              const fromNode = workflowNodes.find((n) => n.id === conn.fromNodeId);
              const toNode = workflowNodes.find((n) => n.id === conn.toNodeId);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + 190;
              const y1 = fromNode.y + 44;
              const x2 = toNode.x;
              const y2 = toNode.y + 44;
              const dx = (x2 - x1) * 0.5;

              return (
                <g key={conn.id}>
                  {/* Subtle shadow wire */}
                  <path
                    d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="#18202f"
                    strokeWidth="4"
                  />
                  {/* Active animated wire */}
                  <path
                    d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={isWorkflowRunning ? 'url(#wireGrad)' : '#334155'}
                    strokeWidth="2"
                    className={isWorkflowRunning ? 'wire-animated' : ''}
                  />
                  {/* Signal node connector dots */}
                  <circle cx={x1} cy={y1} r="4" fill="#f59e0b" />
                  <circle cx={x2} cy={y2} r="4" fill="#06b6d4" />
                </g>
              );
            })}
          </svg>

          {/* Render Graph Nodes */}
          {workflowNodes.map((node) => {
            const isSelected = selectedWorkflowNodeId === node.id;
            let statusBadge = (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">IDLE</span>
            );

            if (node.status === 'running') {
              statusBadge = (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse font-mono font-bold">
                  EM CURSO...
                </span>
              );
            } else if (node.status === 'success') {
              statusBadge = (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono font-bold">
                  <Check className="w-2.5 h-2.5" /> OK
                </span>
              );
            }

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(e, node)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  position: 'absolute',
                  width: '190px',
                }}
                className={`p-3.5 rounded-2xl border shadow-xl cursor-grab active:cursor-grabbing transition-all z-10 font-sans ${
                  isSelected
                    ? 'border-amber-400 bg-[#121927] shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/50'
                    : 'border-[#1a2232] bg-[#0b0e15] hover:border-[#28354c]'
                }`}
              >
                {/* Node Top */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#18202e]">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono">{node.type}</span>
                  {statusBadge}
                </div>

                {/* Node Title & Sublabel */}
                <div className="font-bold text-white text-xs tracking-wide">{node.name}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5 truncate">{node.sublabel}</div>

                {/* Node Input / Output Pins */}
                <div className="mt-3 pt-2 border-t border-[#18202e] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>IN: token</span>
                  <span className="text-cyan-400 font-medium">OUT: sig</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Node Inspector Drawer */}
        <div className="w-80 bg-[#080b12] border-l border-[#18202f] flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-[#18202f] bg-[#0c1018]">
            <span className="font-bold text-xs text-white tracking-wide font-mono uppercase">INSPETOR DE NÓ</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {selectedNode ? (
              <div className="space-y-3.5">
                <div className="p-3 rounded-xl bg-[#0e131d] border border-[#1a2232]">
                  <span className="text-[10px] text-zinc-500 uppercase">Nó Selecionado</span>
                  <div className="text-sm font-bold text-white mt-0.5 font-sans">{selectedNode.name}</div>
                  <div className="text-[11px] text-amber-400 font-mono mt-1">TIPO: {selectedNode.type}</div>
                  <div className="text-[11px] text-cyan-400 font-mono">ESTADO: {selectedNode.status.toUpperCase()}</div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase mb-1">Título do Nó:</label>
                  <input
                    type="text"
                    value={selectedNode.name}
                    readOnly
                    className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase mb-1">Função Operacional:</label>
                  <input
                    type="text"
                    value={selectedNode.sublabel}
                    readOnly
                    className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-zinc-300 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase mb-1">Parâmetros de Configuração:</label>
                  <div className="p-3 bg-[#07090f] border border-[#1d2638] rounded-xl text-[11px] text-zinc-300 space-y-1.5">
                    {Object.entries(selectedNode.config).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-amber-400">{k}:</span>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#18202f]">
                  <button
                    onClick={runWorkflow}
                    className="w-full py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold flex items-center justify-center gap-2 transition-all shadow-md font-sans text-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Disparar a partir deste Nó</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-zinc-600 text-center py-10 font-sans text-xs">
                Clique em qualquer nó do grafo para inspecionar seus parâmetros.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
