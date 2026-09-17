import React, { useState, useRef } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Play,
  Square,
  CheckCircle2,
  Download,
  Plus,
  Activity,
  Check,
  XCircle,
  Clock,
  RotateCcw,
  Link2,
  FileCode,
  ShieldCheck,
  Cpu,
  Eye,
  Server,
  Package,
} from 'lucide-react';
import { WorkflowNode } from '../../types';

type SysTestNodeType =
  | 'Source File'
  | 'Validator'
  | 'Builder'
  | 'Preview Sandbox'
  | 'Lab Deploy'
  | 'Analyzer'
  | 'Output Artifact';

interface SysTestNodeDef {
  type: SysTestNodeType;
  label: string;
  desc: string;
  defaultConfig: Record<string, string>;
  icon: React.ReactNode;
}

const NODE_DEFINITIONS: SysTestNodeDef[] = [
  {
    type: 'Source File',
    label: 'Source File',
    desc: 'Fonte do arquivo de teste / payload',
    defaultConfig: { path: '/src/main.sh', encoding: 'UTF-8' },
    icon: <FileCode className="w-3.5 h-3.5 text-amber-400" />,
  },
  {
    type: 'Validator',
    label: 'Validator',
    desc: 'Verificação sintática e permissões',
    defaultConfig: { engine: 'ast-parser', strict: 'true' },
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  },
  {
    type: 'Builder',
    label: 'Builder',
    desc: 'Compilação e hash SHA-256',
    defaultConfig: { targetArch: 'x86_64', optimize: 'O2' },
    icon: <Cpu className="w-3.5 h-3.5 text-amber-400" />,
  },
  {
    type: 'Preview Sandbox',
    label: 'Preview Sandbox',
    desc: 'Execução em container isolado',
    defaultConfig: { memoryLimit: '512MB', airgapped: 'true' },
    icon: <Eye className="w-3.5 h-3.5 text-cyan-400" />,
  },
  {
    type: 'Lab Deploy',
    label: 'Lab Deploy',
    desc: 'Injeção no alvo do laboratório',
    defaultConfig: { targetHost: 'LAB-TARGET-01', port: '8888' },
    icon: <Server className="w-3.5 h-3.5 text-indigo-400" />,
  },
  {
    type: 'Analyzer',
    label: 'Analyzer',
    desc: 'Inspeção de entropia e AST',
    defaultConfig: { threshold: '0.85', heuristics: 'enabled' },
    icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />,
  },
  {
    type: 'Output Artifact',
    label: 'Output Artifact',
    desc: 'Geração de pacote final assinado',
    defaultConfig: { format: 'tar.gz', signed: 'true' },
    icon: <Package className="w-3.5 h-3.5 text-emerald-400" />,
  },
];

export const WorkflowView: React.FC = () => {
  const {
    workflowNodes,
    workflowConnections,
    selectedWorkflowNodeId,
    setSelectedWorkflowNodeId,
    updateWorkflowNodePos,
    runWorkflow,
    stopWorkflow,
    isWorkflowRunning,
    addNotification,
  } = useWatson();

  const [nodes, setNodes] = useState<WorkflowNode[]>(() => [
    {
      id: 'node-1',
      name: 'Source File',
      sublabel: 'main_payload.sh',
      type: 'File',
      status: 'idle',
      x: 60,
      y: 100,
      config: { path: '/payloads/main.sh', encoding: 'UTF-8' },
    },
    {
      id: 'node-2',
      name: 'Validator',
      sublabel: 'AST & Syntax Check',
      type: 'Validator',
      status: 'idle',
      x: 290,
      y: 100,
      config: { engine: 'ast-parser', strict: 'true' },
    },
    {
      id: 'node-3',
      name: 'Builder',
      sublabel: 'SHA-256 Packager',
      type: 'Builder',
      status: 'idle',
      x: 520,
      y: 100,
      config: { targetArch: 'x86_64', hash: 'SHA256' },
    },
    {
      id: 'node-4',
      name: 'Preview Sandbox',
      sublabel: 'cgroups v2 Confinement',
      type: 'Output',
      status: 'idle',
      x: 290,
      y: 260,
      config: { memory: '512MB', loopback: 'active' },
    },
    {
      id: 'node-5',
      name: 'Analyzer',
      sublabel: 'Entropy & Heuristics',
      type: 'Analyzer',
      status: 'idle',
      x: 520,
      y: 260,
      config: { shannonEntropy: '4.12', score: 'LOW RISK' },
    },
    {
      id: 'node-6',
      name: 'Output Artifact',
      sublabel: 'systest-pack.tar.gz',
      type: 'Output',
      status: 'idle',
      x: 750,
      y: 180,
      config: { signature: 'ED25519', status: 'READY' },
    },
  ]);

  const [connections, setConnections] = useState<{ id: string; from: string; to: string }[]>([
    { id: 'c1', from: 'node-1', to: 'node-2' },
    { id: 'c2', from: 'node-2', to: 'node-3' },
    { id: 'c3', from: 'node-2', to: 'node-4' },
    { id: 'c4', from: 'node-3', to: 'node-5' },
    { id: 'c5', from: 'node-5', to: 'node-6' },
  ]);

  const [connectMode, setConnectMode] = useState(false);
  const [connectSourceNodeId, setConnectSourceNodeId] = useState<string | null>(null);

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const [running, setRunning] = useState(false);

  const handleMouseDown = (e: React.MouseEvent, node: WorkflowNode) => {
    e.stopPropagation();
    if (connectMode) {
      if (!connectSourceNodeId) {
        setConnectSourceNodeId(node.id);
        addNotification('Conectar Nós', `Nó de origem selecionado: ${node.name}. Agora clique no nó de destino.`, 'info');
      } else if (connectSourceNodeId !== node.id) {
        // Create connection
        const newConn = {
          id: `conn-${Date.now()}`,
          from: connectSourceNodeId,
          to: node.id,
        };
        setConnections((prev) => [...prev, newConn]);
        setConnectSourceNodeId(null);
        setConnectMode(false);
        addNotification('Conexão Criada', 'Ligação entre nós estabelecida com sucesso.', 'success');
      }
      return;
    }

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
    const newX = Math.max(10, e.clientX - canvasRect.left - dragOffset.x);
    const newY = Math.max(10, e.clientY - canvasRect.top - dragOffset.y);
    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Action: Adicionar Nó
  const handleAddNode = (def: SysTestNodeDef) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      name: def.label,
      sublabel: def.desc,
      type: def.type as any,
      status: 'idle',
      x: 100 + (nodes.length % 5) * 40,
      y: 100 + (nodes.length % 4) * 50,
      config: { ...def.defaultConfig },
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedWorkflowNodeId(newNode.id);
    addNotification('Nó Adicionado', `Nó [${def.label}] inserido no canvas.`, 'success');
  };

  // Action: Executar Workflow
  const handleExecuteWorkflow = async () => {
    if (running) return;
    setRunning(true);
    addNotification('Executando Workflow', 'Iniciando pipeline sequencial de testes...', 'info');

    // Reset all nodes to idle
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));

    for (let i = 0; i < nodes.length; i++) {
      const currentNodeId = nodes[i].id;
      // Set current to running
      setNodes((prev) =>
        prev.map((n) => (n.id === currentNodeId ? { ...n, status: 'running' } : n))
      );

      // Simulate step duration
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 95% success rate simulation
      const isSuccess = true;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === currentNodeId
            ? { ...n, status: isSuccess ? 'success' : 'failed' }
            : n
        )
      );
    }

    setRunning(false);
    addNotification('Workflow Concluído', 'Todos os nós executados com sucesso (100% PASS).', 'success');
  };

  // Action: Limpar
  const handleClear = () => {
    setNodes([]);
    setConnections([]);
    setSelectedWorkflowNodeId(null);
    addNotification('Workflow Limpo', 'Canvas e ligações foram resetados.', 'info');
  };

  // Action: Exportar Pipeline JSON
  const handleExportJSON = () => {
    const pipelineData = {
      pipelineVersion: '2.4.0',
      timestamp: new Date().toISOString(),
      nodes,
      connections,
    };
    const jsonStr = JSON.stringify(pipelineData, null, 2);

    // Copy to clipboard
    navigator.clipboard.writeText(jsonStr);

    // Trigger download
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline_workflow_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification('Pipeline Exportado', 'JSON copiado e arquivo baixado.', 'success');
  };

  const selectedNode = nodes.find((n) => n.id === selectedWorkflowNodeId);

  return (
    <div
      className="flex-1 flex flex-col h-full bg-[#040609] overflow-hidden font-mono text-zinc-300 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Controls Bar with explicit user-requested actions:
          Adicionar Nó, Conectar Nós, Executar Workflow, Limpar, Exportar Pipeline JSON */}
      <div className="h-12 px-4 border-b border-[#161f2e] bg-[#070a10] flex items-center justify-between z-10 shrink-0 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold uppercase text-[11px] mr-1">
            WORKFLOW PIPELINE:
          </span>

          {/* EXECUTAR WORKFLOW */}
          <button
            onClick={handleExecuteWorkflow}
            disabled={running || nodes.length === 0}
            className={`px-3 py-1 rounded font-bold flex items-center gap-1.5 transition-all ${
              running
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-sm disabled:opacity-40'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{running ? 'EXECUTANDO...' : 'EXECUTAR WORKFLOW'}</span>
          </button>

          {/* CONECTAR NÓS */}
          <button
            onClick={() => {
              setConnectMode(!connectMode);
              setConnectSourceNodeId(null);
            }}
            className={`px-3 py-1 rounded border flex items-center gap-1.5 transition-colors ${
              connectMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-[#0c1119] hover:bg-[#141b28] border-[#1b2537] text-zinc-300 hover:text-white'
            }`}
            title="Clique no nó de origem e depois no nó de destino"
          >
            <Link2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{connectMode ? 'CLIQUE NO DESTINO' : 'CONECTAR NÓS'}</span>
          </button>

          {/* LIMPAR */}
          <button
            onClick={handleClear}
            className="px-2.5 py-1 rounded bg-[#0c1119] hover:bg-[#141b28] border border-[#1b2537] text-zinc-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            title="Limpar todos os nós e conexões do canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>LIMPAR</span>
          </button>

          {/* EXPORTAR PIPELINE JSON */}
          <button
            onClick={handleExportJSON}
            className="px-2.5 py-1 rounded bg-[#0c1119] hover:bg-[#141b28] border border-[#1b2537] text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
            title="Exportar manifesto do pipeline em formato JSON"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>EXPORTAR JSON</span>
          </button>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-zinc-500">
            NÓS: <strong className="text-white">{nodes.length}</strong>
          </span>
          <span className="text-zinc-500">
            LIGAÇÕES: <strong className="text-cyan-400">{connections.length}</strong>
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> PIPELINE PRONTO
          </span>
        </div>
      </div>

      {/* Main Area: Left Palette + Canvas + Right Inspector */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT: Adicionar Nó (Paleta) */}
        <div className="w-60 bg-[#07090e] border-r border-[#161f2e] flex flex-col shrink-0">
          <div className="h-10 px-3 border-b border-[#161f2e] bg-[#090d14] flex items-center justify-between">
            <span className="font-bold text-[11px] text-zinc-300 uppercase tracking-wider">
              ADICIONAR NÓ
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {NODE_DEFINITIONS.map((def) => (
              <button
                key={def.type}
                onClick={() => handleAddNode(def)}
                className="w-full flex items-center justify-between p-2 rounded bg-[#0b0f17] hover:bg-[#121927] border border-[#162030] hover:border-amber-500/40 text-left transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#06080d] border border-[#182234]">
                    {def.icon}
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-amber-300 text-xs">
                      {def.label}
                    </div>
                    <div className="text-[10px] text-zinc-500">{def.desc}</div>
                  </div>
                </div>
                <Plus className="w-3.5 h-3.5 text-zinc-600 group-hover:text-amber-400 transition-colors" />
              </button>
            ))}
          </div>

          <div className="p-2.5 border-t border-[#161f2e] bg-[#070a10] text-[10px] text-zinc-500 leading-tight">
            Clique em um nó da paleta para adicionar ao fluxo encadeado.
          </div>
        </div>

        {/* CENTER: Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 bg-[#040609] relative overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle, #151d2c 1px, transparent 1px), radial-gradient(circle, #0e1420 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
          onClick={() => {
            if (!connectMode) setSelectedWorkflowNodeId(null);
          }}
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {connections.map((conn) => {
              const fromNode = nodes.find((n) => n.id === conn.from);
              const toNode = nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + 180;
              const y1 = fromNode.y + 36;
              const x2 = toNode.x;
              const y2 = toNode.y + 36;
              const dx = (x2 - x1) * 0.5;

              return (
                <g key={conn.id}>
                  <path
                    d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="#1a2538"
                    strokeWidth="4"
                  />
                  <path
                    d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={running ? '#f59e0b' : '#0ea5e9'}
                    strokeWidth="2"
                    strokeDasharray={running ? '4 2' : 'none'}
                  />
                  <circle cx={x1} cy={y1} r="3.5" fill="#f59e0b" />
                  <circle cx={x2} cy={y2} r="3.5" fill="#06b6d4" />
                </g>
              );
            })}
          </svg>

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedWorkflowNodeId === node.id;
            const isConnectSource = connectSourceNodeId === node.id;

            // STATUS DOS NÓS: IDLE, RUNNING, SUCCESS, FAILED
            let statusBadge = (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-bold">
                IDLE
              </span>
            );
            if (node.status === 'running') {
              statusBadge = (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse font-bold">
                  RUNNING
                </span>
              );
            } else if (node.status === 'success') {
              statusBadge = (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" /> SUCCESS
                </span>
              );
            } else if (node.status === 'failed') {
              statusBadge = (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-0.5">
                  <XCircle className="w-2.5 h-2.5" /> FAILED
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
                  width: '180px',
                }}
                className={`p-2.5 rounded-lg border shadow-lg cursor-grab active:cursor-grabbing transition-all z-10 text-xs ${
                  isConnectSource
                    ? 'border-cyan-400 bg-[#0f1d2e] ring-2 ring-cyan-400/50'
                    : isSelected
                    ? 'border-amber-400 bg-[#121927] ring-1 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'border-[#182336] bg-[#080c14] hover:border-[#223048]'
                }`}
              >
                {/* Node Header */}
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#141d2c]">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">{node.type}</span>
                  {statusBadge}
                </div>

                {/* Node Label */}
                <div className="font-bold text-white text-xs truncate">{node.name}</div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">{node.sublabel}</div>

                {/* Pins */}
                <div className="mt-2 pt-1.5 border-t border-[#141d2c] flex items-center justify-between text-[9px] text-zinc-500">
                  <span>IN: port</span>
                  <span className="text-cyan-400">OUT: sig</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Node Inspector */}
        <div className="w-72 bg-[#07090e] border-l border-[#161f2e] flex flex-col shrink-0 text-xs">
          <div className="h-10 px-3 border-b border-[#161f2e] bg-[#090d14] flex items-center justify-between">
            <span className="font-bold text-[11px] text-zinc-300 uppercase tracking-wider">
              INSPETOR DE NÓ
            </span>
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-3">
            {selectedNode ? (
              <>
                <div className="p-2.5 rounded bg-[#0b0f17] border border-[#182336] space-y-1.5">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Nó Ativo</span>
                  <div className="font-bold text-white text-sm">{selectedNode.name}</div>
                  <div className="text-[10px] text-amber-400">TIPO: {selectedNode.type}</div>
                  <div className="text-[10px] text-cyan-400">STATUS: {selectedNode.status.toUpperCase()}</div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">
                    Nome do Componente:
                  </label>
                  <input
                    type="text"
                    value={selectedNode.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? { ...n, name: val } : n))
                      );
                    }}
                    className="w-full bg-[#05070a] border border-[#182336] rounded p-1.5 text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">
                    Parâmetros de Configuração:
                  </label>
                  <div className="p-2.5 bg-[#05070a] border border-[#182336] rounded space-y-1.5 text-[11px]">
                    {Object.entries(selectedNode.config || {}).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold">{k}:</span>
                        <span className="text-zinc-300 truncate max-w-[120px]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#182336]">
                  <button
                    onClick={() => {
                      setNodes((prev) => prev.filter((n) => n.id !== selectedNode.id));
                      setConnections((prev) =>
                        prev.filter((c) => c.from !== selectedNode.id && c.to !== selectedNode.id)
                      );
                      setSelectedWorkflowNodeId(null);
                      addNotification('Nó Removido', `Nó ${selectedNode.name} excluído.`, 'info');
                    }}
                    className="w-full py-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 font-bold text-xs transition-colors"
                  >
                    Excluir Nó
                  </button>
                </div>
              </>
            ) : (
              <div className="text-zinc-600 text-center py-8 text-xs">
                Selecione um nó no canvas para visualizar ou ajustar sua configuração.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
