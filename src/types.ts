export type ViewMode =
  | 'corporate-search'
  | 'dashboard'
  | 'projects'
  | 'file-builder'
  | 'template-builder'
  | 'workflow'
  | 'lab-targets'
  | 'terminal'
  | 'analyzer'
  | 'sessions'
  | 'settings';

export type PipelineStatus =
  | 'idle'
  | 'validating'
  | 'building'
  | 'previewing'
  | 'analyzing'
  | 'ready'
  | 'success'
  | 'warning'
  | 'error';

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  extension?: string;
  content?: string;
  size: number;
  encoding: string;
  permissions: string;
  validationStatus: 'pass' | 'warn' | 'error';
  isReadOnly?: boolean;
  children?: ProjectFile[];
}

export interface LabTarget {
  id: string;
  name: string;
  type: 'LOCAL SANDBOX' | 'TRAINING VM' | 'TEST ENVIRONMENT' | 'CTF DRILL NODE';
  address: string;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE' | 'UNREACHABLE';
  lastConnection: string;
  environment: string;
  notes: string;
  latencyMs?: number;
  openPorts: number[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  targetId: string;
  environment: string;
  status: 'READY' | 'IDLE' | 'BUILDING' | 'VALIDATED' | 'ALERT';
  lastBuild: string;
  lastBuildHash: string;
  filesCount: number;
  warningsCount: number;
  tags: string[];
}

export interface TemplateComponent {
  id: string;
  type:
    | 'Header'
    | 'Text'
    | 'Button'
    | 'Form'
    | 'Image'
    | 'Table'
    | 'Code Block'
    | 'Warning'
    | 'Status';
  label: string;
  properties: {
    title?: string;
    content?: string;
    variant?: string;
    fields?: string[];
    caption?: string;
    level?: string;
    language?: string;
    icon?: string;
    action?: string;
    state?: string;
  };
}

export interface WorkflowNode {
  id: string;
  type: 'Input' | 'File' | 'Template' | 'Validator' | 'Builder' | 'Analyzer' | 'Output';
  name: string;
  sublabel: string;
  x: number;
  y: number;
  status: 'idle' | 'running' | 'success' | 'failed';
  config: Record<string, string>;
}

export interface WorkflowConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}

export interface SessionEvent {
  id: string;
  timestamp: string;
  type: 'INIT' | 'HANDSHAKE' | 'PAYLOAD' | 'PROBE' | 'SANDBOX_EVENT' | 'WARN' | 'TERMINATE';
  message: string;
  severity: 'info' | 'warn' | 'error' | 'success';
}

export interface LabSession {
  id: string;
  projectId: string;
  targetId: string;
  started: string;
  duration: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'TERMINATED';
  events: SessionEvent[];
}

export interface AnalysisFinding {
  id: string;
  ruleId: string;
  severity: 'PASS' | 'WARNING' | 'ERROR';
  category: 'STRUCTURE' | 'CONFIGURATION' | 'SANDBOX' | 'COMPILER' | 'SECURITY';
  target: string;
  message: string;
  remediation: string;
}

export interface FileMetadataAnalysis {
  name: string;
  path: string;
  mimeType: string;
  entropy: number;
  sha256: string;
  sizeBytes: number;
  sandboxFlags: string[];
}

export interface TerminalOutputLine {
  id: string;
  text: string;
  type: 'command' | 'output' | 'error' | 'success' | 'warn' | 'system';
  timestamp: string;
}

export interface TerminalTab {
  id: string;
  name: string;
  lines: TerminalOutputLine[];
  cwd: string;
}

export interface AppSettings {
  theme: 'dark-graphite' | 'midnight-coal';
  accentColor: 'amber' | 'cyan' | 'emerald';
  fontSize: '13px' | '14px' | '15px';
  terminalFont: 'Fira Code' | 'JetBrains Mono' | 'Monospace';
  defaultWorkspace: string;
  autoSave: boolean;
  confirmDestructiveActions: boolean;
  sandboxIsolation: 'STRICT_AIRGAP' | 'VIRTUAL_TAP' | 'RESTRICTED_BRIDGE';
  checksumAlgorithm: 'SHA-256' | 'SHA-512' | 'BLAKE3';
  logLevel: 'DEBUG' | 'INFO' | 'WARN';
}

export interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}
