import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ViewMode,
  PipelineStatus,
  Project,
  ProjectFile,
  LabTarget,
  LabSession,
  AnalysisFinding,
  FileMetadataAnalysis,
  WorkflowNode,
  WorkflowConnection,
  TemplateComponent,
  AppSettings,
  TerminalTab,
  TerminalOutputLine,
  NotificationToast,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_FILES,
  INITIAL_TARGETS,
  INITIAL_SESSIONS,
  INITIAL_FINDINGS,
  INITIAL_FILE_METADATA,
  INITIAL_TEMPLATE_COMPONENTS,
  INITIAL_WORKFLOW_NODES,
  INITIAL_WORKFLOW_CONNECTIONS,
  INITIAL_TERMINAL_TABS,
  INITIAL_SETTINGS,
} from '../data/initialData';

interface WatsonContextType {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  projects: Project[];
  activeProject: Project;
  setActiveProject: (p: Project) => void;
  createProject: (name: string, description: string, targetId: string) => void;
  targets: LabTarget[];
  activeTarget: LabTarget;
  setActiveTarget: (t: LabTarget) => void;
  toggleTargetStatus: (id: string) => void;
  pingTarget: (id: string) => void;
  files: ProjectFile[];
  activeFile: ProjectFile | null;
  setActiveFile: (file: ProjectFile | null) => void;
  updateFileContent: (id: string, content: string) => void;
  saveFile: (id: string) => void;
  createFile: (parentFolderId: string | null, name: string, type: 'file' | 'folder') => void;
  deleteFile: (id: string) => void;
  pipelineStatus: PipelineStatus;
  pipelineProgress: number;
  runValidation: () => Promise<boolean>;
  runBuild: () => Promise<boolean>;
  runPreview: () => void;
  runAnalysis: () => Promise<boolean>;
  runExport: () => Promise<boolean>;
  runFullPipeline: () => Promise<void>;
  templateComponents: TemplateComponent[];
  selectedTemplateComponentId: string | null;
  setSelectedTemplateComponentId: (id: string | null) => void;
  addTemplateComponent: (type: TemplateComponent['type']) => void;
  updateTemplateComponent: (id: string, props: Partial<TemplateComponent['properties']>) => void;
  removeTemplateComponent: (id: string) => void;
  moveTemplateComponent: (id: string, direction: 'up' | 'down') => void;
  duplicateTemplateComponent: (id: string) => void;
  workflowNodes: WorkflowNode[];
  workflowConnections: WorkflowConnection[];
  selectedWorkflowNodeId: string | null;
  setSelectedWorkflowNodeId: (id: string | null) => void;
  addWorkflowNode: (type: WorkflowNode['type']) => void;
  updateWorkflowNodePos: (id: string, x: number, y: number) => void;
  runWorkflow: () => Promise<void>;
  stopWorkflow: () => void;
  isWorkflowRunning: boolean;
  terminalTabs: TerminalTab[];
  activeTerminalTabId: string;
  setActiveTerminalTabId: (id: string) => void;
  executeTerminalCommand: (cmd: string) => void;
  clearTerminal: () => void;
  createTerminalTab: () => void;
  sessions: LabSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  stopSession: (id: string) => void;
  deleteSession: (id: string) => void;
  findings: AnalysisFinding[];
  fileMetadata: FileMetadataAnalysis[];
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  notifications: NotificationToast[];
  addNotification: (title: string, message: string, type?: NotificationToast['type']) => void;
  dismissNotification: (id: string) => void;
  previewModalOpen: boolean;
  setPreviewModalOpen: (open: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  newProjectModalOpen: boolean;
  setNewProjectModalOpen: (open: boolean) => void;
  telemetry: { cpu: number; ram: string; uptime: string };
  bottomDockOpen: boolean;
  setBottomDockOpen: (open: boolean) => void;
  bottomDockTab: 'terminal' | 'output' | 'events';
  setBottomDockTab: (tab: 'terminal' | 'output' | 'events') => void;
  toggleBottomDock: () => void;
}

const WatsonContext = createContext<WatsonContextType | undefined>(undefined);

export const WatsonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [targets, setTargets] = useState<LabTarget[]>(INITIAL_TARGETS);
  const [activeTargetId, setActiveTargetId] = useState<string>(INITIAL_TARGETS[0].id);

  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);
  // Default selected file: credential_audit_drill.html
  const [activeFileId, setActiveFileId] = useState<string>('file-auth-drill');

  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>('ready');
  const [pipelineProgress, setPipelineProgress] = useState<number>(100);

  const [bottomDockOpen, setBottomDockOpen] = useState<boolean>(false);
  const [bottomDockTab, setBottomDockTab] = useState<'terminal' | 'output' | 'events'>('terminal');
  const toggleBottomDock = () => setBottomDockOpen((prev) => !prev);

  const [templateComponents, setTemplateComponents] = useState<TemplateComponent[]>(INITIAL_TEMPLATE_COMPONENTS);
  const [selectedTemplateComponentId, setSelectedTemplateComponentId] = useState<string | null>('cmp-1');

  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>(INITIAL_WORKFLOW_NODES);
  const [workflowConnections, setWorkflowConnections] = useState<WorkflowConnection[]>(INITIAL_WORKFLOW_CONNECTIONS);
  const [selectedWorkflowNodeId, setSelectedWorkflowNodeId] = useState<string | null>('node-build');
  const [isWorkflowRunning, setIsWorkflowRunning] = useState<boolean>(false);

  const [terminalTabs, setTerminalTabs] = useState<TerminalTab[]>(INITIAL_TERMINAL_TABS);
  const [activeTerminalTabId, setActiveTerminalTabId] = useState<string>(INITIAL_TERMINAL_TABS[0].id);

  const [sessions, setSessions] = useState<LabSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>(INITIAL_SESSIONS[0].id);

  const [findings, setFindings] = useState<AnalysisFinding[]>(INITIAL_FINDINGS);
  const [fileMetadata, setFileMetadata] = useState<FileMetadataAnalysis[]>(INITIAL_FILE_METADATA);

  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationToast[]>([
    {
      id: 'notif-1',
      title: 'Sandbox Initialized',
      message: 'Watson Security Toolkit running in local airgap mode.',
      type: 'info',
      timestamp: '14:15',
    },
  ]);

  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);

  // Dynamic telemetry simulator
  const [telemetry, setTelemetry] = useState({ cpu: 14, ram: '1.4 / 8.0 GB', uptime: '02:41:18' });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        cpu: Math.floor(10 + Math.random() * 12),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut for Command Palette: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const activeTarget = targets.find((t) => t.id === activeTargetId) || targets[0];

  // Helper to find file by ID across tree
  const findFileById = (items: ProjectFile[], id: string): ProjectFile | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findFileById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFile = findFileById(files, activeFileId);

  const addNotification = (title: string, message: string, type: NotificationToast['type'] = 'info') => {
    const newNotif: NotificationToast = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const setActiveProject = (p: Project) => {
    setActiveProjectId(p.id);
    addNotification('Projeto Selecionado', `Workspace ativo alternado para ${p.name}`, 'info');
  };

  const createProject = (name: string, description: string, targetId: string) => {
    const newProj: Project = {
      id: 'proj-' + Date.now(),
      name: name.toUpperCase().replace(/\s+/g, '-'),
      description,
      targetId,
      environment: 'LOCAL SANDBOX [AIRGAPPED]',
      status: 'IDLE',
      lastBuild: 'Não compilado',
      lastBuildHash: '00000000000000000000000000000000',
      filesCount: 6,
      warningsCount: 0,
      tags: ['lab-drill', 'customizado'],
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    addNotification('Projeto Criado', `Workspace ${newProj.name} criado com sucesso.`, 'success');
  };

  const setActiveTarget = (t: LabTarget) => {
    setActiveTargetId(t.id);
    addNotification('Alvo Vinculado', `Alvo do laboratório associado: ${t.name} (${t.address})`, 'info');
  };

  const toggleTargetStatus = (id: string) => {
    setTargets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
          return {
            ...t,
            status: nextStatus,
            lastConnection: nextStatus === 'ONLINE' ? 'Agora mesmo' : t.lastConnection,
            latencyMs: nextStatus === 'ONLINE' ? Math.floor(Math.random() * 5) + 1 : 0,
          };
        }
        return t;
      }),
    );
  };

  const pingTarget = (id: string) => {
    const tgt = targets.find((t) => t.id === id);
    if (!tgt) return;
    addNotification('Teste de Ping', `Disparando ping para ${tgt.address}... Status: ${tgt.status}`, tgt.status === 'ONLINE' ? 'success' : 'warning');
    // Also append to active terminal
    appendTerminalLine(`watson@lab:~$ ping -c 3 ${tgt.address.split(':')[0]}`, 'command');
    if (tgt.status === 'ONLINE') {
      appendTerminalLine(`64 bytes de ${tgt.address}: icmp_seq=1 ttl=64 tempo=0.912 ms`, 'output');
      appendTerminalLine(`--- Estatísticas de ping para ${tgt.name} --- 3 pacotes transmitidos, 3 recebidos, 0% de perda`, 'success');
    } else {
      appendTerminalLine(`De 127.0.0.1 icmp_seq=1 Host de destino inacessível`, 'error');
    }
  };

  const setActiveFile = (file: ProjectFile | null) => {
    if (file) {
      setActiveFileId(file.id);
    }
  };

  const updateFileContent = (id: string, newContent: string) => {
    const updateRecursive = (items: ProjectFile[]): ProjectFile[] => {
      return items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            content: newContent,
            size: new TextEncoder().encode(newContent).length,
          };
        }
        if (item.children) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };
    setFiles(updateRecursive(files));
  };

  const saveFile = (id: string) => {
    const file = findFileById(files, id);
    if (file) {
      addNotification('Arquivo Salvo', `Salvo ${file.path} (${file.size} bytes)`, 'success');
      appendTerminalLine(`[+] Alterações gravadas em ${file.path} [${file.size} bytes, chmod ${file.permissions}]`, 'output');
    }
  };

  const createFile = (parentFolderId: string | null, name: string, type: 'file' | 'folder') => {
    const newId = 'file-' + Date.now();
    const ext = type === 'file' ? name.split('.').pop() || 'txt' : undefined;
    const newFile: ProjectFile = {
      id: newId,
      name,
      path: name,
      type,
      extension: ext,
      size: type === 'file' ? 64 : 4096,
      encoding: type === 'file' ? 'UTF-8' : 'directory',
      permissions: type === 'file' ? '-rw-r--r--' : 'drwxr-xr-x',
      validationStatus: 'pass',
      content: type === 'file' ? `# ${name}\n# Arquivo de Teste Watson Security Toolkit\n` : undefined,
      children: type === 'folder' ? [] : undefined,
    };

    if (!parentFolderId) {
      setFiles((prev) => [...prev, newFile]);
    } else {
      const insertInFolder = (items: ProjectFile[]): ProjectFile[] => {
        return items.map((item) => {
          if (item.id === parentFolderId && item.children) {
            return { ...item, children: [...item.children, { ...newFile, path: `${item.path}/${name}` }] };
          }
          if (item.children) {
            return { ...item, children: insertInFolder(item.children) };
          }
          return item;
        });
      };
      setFiles(insertInFolder(files));
    }
    addNotification('Sistema Atualizado', `Criado ${type === 'file' ? 'arquivo' : 'diretório'} ${name}`, 'success');
  };

  const deleteFile = (id: string) => {
    const deleteRecursive = (items: ProjectFile[]): ProjectFile[] => {
      return items
        .filter((item) => item.id !== id)
        .map((item) => {
          if (item.children) {
            return { ...item, children: deleteRecursive(item.children) };
          }
          return item;
        });
    };
    setFiles(deleteRecursive(files));
    addNotification('Item Removido', `Item excluído da árvore do workspace`, 'info');
  };

  const appendTerminalLine = (text: string, type: TerminalOutputLine['type'] = 'output') => {
    const newLine: TerminalOutputLine = {
      id: 'term-line-' + Date.now() + Math.random(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setTerminalTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === activeTerminalTabId) {
          return { ...tab, lines: [...tab.lines, newLine] };
        }
        return tab;
      }),
    );
  };

  // Pipeline execution methods
  const runValidation = async (): Promise<boolean> => {
    setPipelineStatus('validating');
    setPipelineProgress(30);
    appendTerminalLine(`watson@lab:~$ watson validate --strict --target=${activeTarget.name}`, 'command');
    appendTerminalLine(`[+] Validando estrutura de diretórios do workspace... [OK]`, 'output');
    appendTerminalLine(`[+] Inspecionando flags de confinamento em sandbox... [OK]`, 'output');
    appendTerminalLine(`[+] Verificando permissões e sintaxe em 8 arquivos do projeto... [OK]`, 'output');
    appendTerminalLine(`[!] Verificação de ativos opcionais: 1 aviso encontrado (ícone secundário)`, 'warn');
    appendTerminalLine(`[+] Validação concluída: 0 erros, 1 aviso. STATUS: VALIDADO`, 'success');

    await new Promise((res) => setTimeout(res, 600));
    setPipelineStatus('ready');
    setPipelineProgress(100);
    addNotification('Validação Aprovada', 'Sintaxe e confinamento em sandbox verificados.', 'success');
    return true;
  };

  const runBuild = async (): Promise<boolean> => {
    setPipelineStatus('building');
    setPipelineProgress(20);
    appendTerminalLine(`watson@lab:~$ watson build --pack --checksum=sha256 --sandbox=airgap`, 'command');
    appendTerminalLine(`[+] Compilando templates e manifestos de configuração...`, 'output');
    
    await new Promise((res) => setTimeout(res, 400));
    setPipelineProgress(60);
    appendTerminalLine(`[+] Embutindo metadados de confinamento no binário de saída...`, 'output');
    appendTerminalLine(`[+] Calculando hash criptográfico SHA-256: 8e4f1a23b9d0c8741e2a849f7e5102ab`, 'output');
    
    await new Promise((res) => setTimeout(res, 400));
    setPipelineProgress(100);
    setPipelineStatus('success');

    const updatedProjects = projects.map((p) => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          lastBuild: 'Agora mesmo (UTC)',
          lastBuildHash: '8e4f1a23b9d0c874' + Math.random().toString(16).substring(2, 10),
          status: 'READY' as const,
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    addNotification('Compilação Concluída', 'Artefato watson_drill_artifact.bin gerado em output/ (SHA-256 verificado)', 'success');
    return true;
  };

  const runPreview = () => {
    setPreviewModalOpen(true);
    addNotification('Prévia Aberta', 'Renderizando template simulado no visualizador de sandbox isolado', 'info');
  };

  const runAnalysis = async (): Promise<boolean> => {
    setPipelineStatus('analyzing');
    appendTerminalLine(`watson@lab:~$ watson analyze --deep-entropy --ast-rules=all`, 'command');
    appendTerminalLine(`[+] Análise de entropia de Shannon: média 4.81 bits/byte (Nominal para ASCII)`, 'output');
    appendTerminalLine(`[+] Verificação de isolamento de rede: Airgap em loopback estrito ativo.`, 'success');
    appendTerminalLine(`[+] Apontamentos gerados: 4 APROVADOS, 1 AVISO, 0 ERROS.`, 'success');

    await new Promise((res) => setTimeout(res, 500));
    setPipelineStatus('ready');
    setActiveView('analyzer');
    addNotification('Análise Concluída', 'Apontamentos de segurança e telemetria de entropia atualizados.', 'success');
    return true;
  };

  const runExport = async (): Promise<boolean> => {
    setPipelineStatus('building');
    appendTerminalLine(`watson@lab:~$ watson export --format=bundle --dest=${activeTarget.address}`, 'command');
    await new Promise((res) => setTimeout(res, 500));
    appendTerminalLine(`[+] Pacote transferido para quarentena da sandbox em /tmp/watson_quarantine/`, 'success');
    appendTerminalLine(`[+] Exportação concluída com assinatura SHA-256.`, 'success');
    setPipelineStatus('ready');
    addNotification('Exportação Concluída', `Pacote implantado na quarentena do alvo ${activeTarget.name}.`, 'success');
    return true;
  };

  const runFullPipeline = async () => {
    addNotification('Pipeline Iniciada', 'Executando pipeline completa: Validar -> Compilar -> Analisar', 'info');
    await runValidation();
    await runBuild();
    await runAnalysis();
    addNotification('Pipeline Finalizada', 'Suíte completa de verificação e compilação concluída com sucesso.', 'success');
  };

  // Template builder actions
  const addTemplateComponent = (type: TemplateComponent['type']) => {
    const id = 'cmp-' + Date.now();
    let defaultProps: TemplateComponent['properties'] = {};
    if (type === 'Header') defaultProps = { title: 'Nova Seção de Simulação', caption: 'Cabeçalho simulado de laboratório' };
    else if (type === 'Text') defaultProps = { content: 'Por favor, siga as orientações do exercício autorizado de laboratório.' };
    else if (type === 'Button') defaultProps = { title: 'Confirmar Ação de Teste', variant: 'amber-solid' };
    else if (type === 'Form') defaultProps = { fields: ['usuario_teste', 'token_teste'], action: '/api/drill-sink' };
    else if (type === 'Warning') defaultProps = { content: 'AVISO: Simulação estritamente em ambiente sandbox airgapped.', level: 'warning' };
    else if (type === 'Code Block') defaultProps = { content: 'watson --verify --signature=SIG-001', language: 'bash' };
    else if (type === 'Table') defaultProps = { caption: 'Checklist de Vetores do Treinamento' };
    else defaultProps = { state: 'Verificado e Nominal' };

    const newCmp: TemplateComponent = {
      id,
      type,
      label: `Componente ${type}`,
      properties: defaultProps,
    };
    setTemplateComponents((prev) => [...prev, newCmp]);
    setSelectedTemplateComponentId(id);
    addNotification('Componente Adicionado', `Inserido ${type} na tela de composição`, 'info');
  };

  const updateTemplateComponent = (id: string, props: Partial<TemplateComponent['properties']>) => {
    setTemplateComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, properties: { ...c.properties, ...props } } : c)),
    );
  };

  const removeTemplateComponent = (id: string) => {
    setTemplateComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedTemplateComponentId === id) {
      setSelectedTemplateComponentId(null);
    }
  };

  const moveTemplateComponent = (id: string, direction: 'up' | 'down') => {
    setTemplateComponents((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const duplicateTemplateComponent = (id: string) => {
    const item = templateComponents.find((c) => c.id === id);
    if (!item) return;
    const duplicated: TemplateComponent = {
      ...item,
      id: 'cmp-' + Date.now(),
      label: `${item.label} (Copy)`,
    };
    setTemplateComponents((prev) => [...prev, duplicated]);
    setSelectedTemplateComponentId(duplicated.id);
  };

  // Workflow builder actions
  const addWorkflowNode = (type: WorkflowNode['type']) => {
    const id = 'node-' + Date.now();
    const count = workflowNodes.length;
    const newNode: WorkflowNode = {
      id,
      type,
      name: type.toUpperCase(),
      sublabel: `Passo customizado ${type}`,
      x: 100 + (count % 4) * 220,
      y: 260 + Math.floor(count / 4) * 120,
      status: 'idle',
      config: { active: 'true', mode: 'sandbox' },
    };
    setWorkflowNodes((prev) => [...prev, newNode]);
    setSelectedWorkflowNodeId(id);
    addNotification('Nó de Workflow Adicionado', `Adicionado nó de ${type} ao grafo visual`, 'info');
  };

  const updateWorkflowNodePos = (id: string, x: number, y: number) => {
    setWorkflowNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x: Math.max(20, x), y: Math.max(20, y) } : n)),
    );
  };

  const runWorkflow = async () => {
    setIsWorkflowRunning(true);
    addNotification('Executando Workflow', 'Simulando pipeline de nós no grafo...', 'info');
    appendTerminalLine(`watson@lab:~$ watson-workflow run --graph=main-pipeline`, 'command');

    // Run sequentially through nodes
    for (const node of workflowNodes) {
      setWorkflowNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: 'running' } : n)),
      );
      appendTerminalLine(`[NÓ: ${node.name}] Iniciando execução (${node.sublabel})...`, 'output');
      await new Promise((res) => setTimeout(res, 600));
      setWorkflowNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: 'success' } : n)),
      );
      appendTerminalLine(`[NÓ: ${node.name}] Etapa concluída com sucesso. Saída gerada.`, 'success');
    }

    setIsWorkflowRunning(false);
    addNotification('Workflow Concluído', 'Todos os nós do grafo foram finalizados com êxito.', 'success');
  };

  const stopWorkflow = () => {
    setIsWorkflowRunning(false);
    setWorkflowNodes((prev) =>
      prev.map((n) => (n.status === 'running' ? { ...n, status: 'idle' } : n)),
    );
    addNotification('Workflow Interrompido', 'Execução abortada pelo operador.', 'warning');
    appendTerminalLine(`[!] Workflow cancelado pelo sinal SIGINT do operador.`, 'warn');
  };

  // Terminal commands interpreter
  const executeTerminalCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    appendTerminalLine(`systest@kali-lab:~/projects/${activeProject.name.toLowerCase()}$ ${trimmed}`, 'command');
    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg1 = parts[1]?.toLowerCase();
    const arg2 = parts[2];

    if (cmd === 'systest') {
      if (!arg1 || arg1 === 'help') {
        appendTerminalLine('┌── SYSTEST WORKSTATION CLI (KALI-LAB) ──────────────────────────┐', 'system');
        appendTerminalLine('│ systest run              - Compilar e disparar artefato no lab  │', 'system');
        appendTerminalLine('│ systest build            - Compilar pacote e gerar SHA-256      │', 'system');
        appendTerminalLine('│ systest validate         - Checar conformidade, regras e airgap │', 'system');
        appendTerminalLine('│ systest scan             - Inspeção profunda de entropia e AST  │', 'system');
        appendTerminalLine('│ systest target list      - Listar nós e alvos do laboratório    │', 'system');
        appendTerminalLine('│ systest target set <id>  - Definir nó como alvo operacional     │', 'system');
        appendTerminalLine('└─────────────────────────────────────────────────────────────────┘', 'system');
        return;
      }

      if (arg1 === 'run') {
        runBuild();
        return;
      }
      if (arg1 === 'build') {
        runBuild();
        return;
      }
      if (arg1 === 'validate') {
        runValidation();
        return;
      }
      if (arg1 === 'scan') {
        runAnalysis();
        return;
      }
      if (arg1 === 'target') {
        if (arg2 === 'list' || !arg2) {
          targets.forEach((t) => {
            appendTerminalLine(`[${t.status === 'ONLINE' ? '+' : '-'}] ${t.name.padEnd(18)} ${t.address.padEnd(16)} (${t.type}) - ${t.status}`, t.status === 'ONLINE' ? 'success' : 'warn');
          });
          return;
        }
        if (arg2 === 'set') {
          const targetId = parts[3];
          const found = targets.find((t) => t.id === targetId || t.name.toLowerCase() === targetId?.toLowerCase());
          if (found) {
            setActiveTarget(found);
            appendTerminalLine(`[+] Alvo ativo configurado para ${found.name} (${found.address})`, 'success');
          } else {
            appendTerminalLine(`[-] Alvo '${targetId}' não encontrado. Use 'systest target list'.`, 'error');
          }
          return;
        }
      }
    }

    if (cmd === 'ping') {
      const tgt = arg1 || activeTarget.address;
      appendTerminalLine(`PING ${tgt} 56(84) bytes of data (Airgap Loopback Simulation):`, 'output');
      appendTerminalLine(`64 bytes from ${tgt}: icmp_seq=1 ttl=64 time=1.24 ms`, 'output');
      appendTerminalLine(`64 bytes from ${tgt}: icmp_seq=2 ttl=64 time=0.98 ms`, 'output');
      appendTerminalLine(`--- ${tgt} ping statistics --- 2 packets transmitted, 2 received, 0% packet loss`, 'success');
      return;
    }

    switch (cmd) {
      case 'help':
      case 'ajuda':
        appendTerminalLine('┌── SYSTEST COMANDOS & SEGURANÇA ────────────────────────────────┐', 'system');
        appendTerminalLine('│ systest <run|build|validate|scan|target>                       │', 'system');
        appendTerminalLine('│ ping <target>         - Disparar ICMP echo para o alvo          │', 'system');
        appendTerminalLine('│ validate / validar    - Executar análise de sintaxe e sandbox   │', 'system');
        appendTerminalLine('│ build / compilar      - Compilar artefato e calcular sha256     │', 'system');
        appendTerminalLine('│ preview / previa      - Abrir modal de prévia isolada           │', 'system');
        appendTerminalLine('│ analyze / analisar    - Rodar inspeção profunda e entropia      │', 'system');
        appendTerminalLine('│ export / exportar     - Empacotar artefato para alvo ativo      │', 'system');
        appendTerminalLine('│ ls                    - Listar arquivos na árvore do workspace  │', 'system');
        appendTerminalLine('│ cat <arquivo>         - Exibir conteúdo do arquivo no sandbox   │', 'system');
        appendTerminalLine('│ clear / limpar        - Limpar a tela do terminal               │', 'system');
        appendTerminalLine('│ whoami / id           - Exibir token de segurança do operador   │', 'system');
        appendTerminalLine('└─────────────────────────────────────────────────────────────────┘', 'system');
        break;
        appendTerminalLine('│ preview / previa      - Abrir modal de prévia isolada           │', 'system');
        appendTerminalLine('│ analyze / analisar    - Rodar inspeção profunda e entropia      │', 'system');
        appendTerminalLine('│ export / exportar     - Empacotar artefato para alvo ativo      │', 'system');
        appendTerminalLine('│ ls                    - Listar arquivos na árvore do workspace  │', 'system');
        appendTerminalLine('│ cat <arquivo>         - Exibir conteúdo do arquivo no sandbox   │', 'system');
        appendTerminalLine('│ target list           - Mostrar status dos alvos do laboratório │', 'system');
        appendTerminalLine('│ target test           - Disparar ping no alvo ativo             │', 'system');
        appendTerminalLine('│ workflow run          - Iniciar execução da pipeline visual     │', 'system');
        appendTerminalLine('│ sessions              - Listar sessões ativas do sandbox        │', 'system');
        appendTerminalLine('│ clear / limpar        - Limpar a tela do terminal               │', 'system');
        appendTerminalLine('│ whoami / id           - Exibir token de segurança do operador   │', 'system');
        appendTerminalLine('└─────────────────────────────────────────────────────────────────┘', 'system');
        break;

      case 'validate':
      case 'validar':
        runValidation();
        break;

      case 'build':
      case 'compilar':
        runBuild();
        break;

      case 'preview':
      case 'previa':
        runPreview();
        break;

      case 'analyze':
      case 'analisar':
        runAnalysis();
        break;

      case 'export':
      case 'exportar':
        runExport();
        break;

      case 'clear':
      case 'limpar':
        clearTerminal();
        break;

      case 'whoami':
        appendTerminalLine('watson (uid=1001/watson gid=1001/sec-toolkit grupos=1001,sudo,docker)', 'output');
        break;

      case 'id':
        appendTerminalLine('uid=1001(watson) gid=1001(sec-toolkit) grupos=1001(sec-toolkit),27(sudo),998(docker) context=watson_sandbox_u:r:sandbox_t:s0', 'output');
        break;

      case 'ls':
        appendTerminalLine('assets/  templates/  configs/  scripts/  output/  README.md', 'output');
        break;

      case 'cat':
        if (!arg1) {
          appendTerminalLine('Uso: cat <nome_arquivo> (ex: cat README.md)', 'error');
        } else {
          const matched = findFileById(files, arg1) || files.find((f) => f.name.toLowerCase() === arg1.toLowerCase());
          if (matched && matched.content) {
            matched.content.split('\n').slice(0, 15).forEach((line) => appendTerminalLine(line, 'output'));
            if (matched.content.split('\n').length > 15) {
              appendTerminalLine(`... [${matched.content.split('\n').length - 15} linhas omitidas]`, 'warn');
            }
          } else {
            appendTerminalLine(`cat: ${arg1}: Arquivo ou diretório não encontrado na raiz do projeto`, 'error');
          }
        }
        break;

      case 'target':
        if (arg1 === 'list') {
          targets.forEach((t) => {
            appendTerminalLine(`[${t.status === 'ONLINE' ? '+' : '-'}] ${t.name.padEnd(16)} ${t.address.padEnd(18)} (${t.type}) - ${t.status}`, t.status === 'ONLINE' ? 'success' : 'warn');
          });
        } else if (arg1 === 'test') {
          pingTarget(activeTarget.id);
        } else {
          appendTerminalLine('Uso: target [list | test]', 'error');
        }
        break;

      case 'sessions':
        sessions.forEach((s) => {
          appendTerminalLine(`[SESSÃO] ${s.id} | Projeto: ${s.projectId} | Alvo: ${s.targetId} | Status: ${s.status}`, 'output');
        });
        break;

      case 'workflow':
        if (arg1 === 'run') {
          runWorkflow();
        } else {
          appendTerminalLine('Uso: workflow run', 'error');
        }
        break;

      default:
        appendTerminalLine(`bash: ${cmd}: comando não reconhecido. Digite 'ajuda' ou 'help' para comandos do Watson.`, 'error');
        break;
    }
  };

  const clearTerminal = () => {
    setTerminalTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === activeTerminalTabId) {
          return {
            ...tab,
            lines: [
              {
                id: 'term-cleared-' + Date.now(),
                text: '┌─ TELA DO TERMINAL WATSON LIMPA ────────────────────────────────┐',
                type: 'system',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              },
            ],
          };
        }
        return tab;
      }),
    );
  };

  const createTerminalTab = () => {
    const id = 'tab-' + Date.now();
    const newTab: TerminalTab = {
      id,
      name: `bash-${terminalTabs.length + 1}`,
      cwd: '~/projects/' + activeProject.name,
      lines: [
        {
          id: 'l-init-' + Date.now(),
          text: `[+] Sessão isolada iniciada no workspace ${activeProject.name}`,
          type: 'system',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ],
    };
    setTerminalTabs((prev) => [...prev, newTab]);
    setActiveTerminalTabId(id);
  };

  // Sessions management
  const stopSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'TERMINATED' } : s)),
    );
    addNotification('Sessão Encerrada', `Sessão de laboratório ${id} foi finalizada.`, 'warning');
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    addNotification('Sessão Removida', `Sessão ${id} removida do registro de auditoria.`, 'info');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addNotification('Preferências Atualizadas', 'Configurações do toolkit sincronizadas com sucesso.', 'success');
  };

  return (
    <WatsonContext.Provider
      value={{
        activeView,
        setActiveView,
        projects,
        activeProject,
        setActiveProject,
        createProject,
        targets,
        activeTarget,
        setActiveTarget,
        toggleTargetStatus,
        pingTarget,
        files,
        activeFile,
        setActiveFile,
        updateFileContent,
        saveFile,
        createFile,
        deleteFile,
        pipelineStatus,
        pipelineProgress,
        runValidation,
        runBuild,
        runPreview,
        runAnalysis,
        runExport,
        runFullPipeline,
        templateComponents,
        selectedTemplateComponentId,
        setSelectedTemplateComponentId,
        addTemplateComponent,
        updateTemplateComponent,
        removeTemplateComponent,
        moveTemplateComponent,
        duplicateTemplateComponent,
        workflowNodes,
        workflowConnections,
        selectedWorkflowNodeId,
        setSelectedWorkflowNodeId,
        addWorkflowNode,
        updateWorkflowNodePos,
        runWorkflow,
        stopWorkflow,
        isWorkflowRunning,
        terminalTabs,
        activeTerminalTabId,
        setActiveTerminalTabId,
        executeTerminalCommand,
        clearTerminal,
        createTerminalTab,
        sessions,
        activeSessionId,
        setActiveSessionId,
        stopSession,
        deleteSession,
        findings,
        fileMetadata,
        settings,
        updateSettings,
        notifications,
        addNotification,
        dismissNotification,
        previewModalOpen,
        setPreviewModalOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        newProjectModalOpen,
        setNewProjectModalOpen,
        telemetry,
        bottomDockOpen,
        setBottomDockOpen,
        bottomDockTab,
        setBottomDockTab,
        toggleBottomDock,
      }}
    >
      {children}
    </WatsonContext.Provider>
  );
};

export const useWatson = () => {
  const context = useContext(WatsonContext);
  if (!context) {
    throw new Error('useWatson must be used within a WatsonProvider');
  }
  return context;
};
