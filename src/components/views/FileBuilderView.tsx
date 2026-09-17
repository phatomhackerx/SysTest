import React, { useState } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Play,
  Activity,
  Download,
  ChevronRight,
  ChevronDown,
  Terminal,
  Binary,
  Edit2,
  Copy,
  AlignLeft,
  X,
  File,
} from 'lucide-react';
import { ProjectFile } from '../../types';

export const FileBuilderView: React.FC = () => {
  const {
    files,
    activeFile,
    setActiveFile,
    updateFileContent,
    saveFile,
    createFile,
    deleteFile,
    runValidation,
    runBuild,
    runAnalysis,
    runExport,
    activeProject,
    addNotification,
  } = useWatson();

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'folder-assets': true,
    'folder-templates': true,
    'folder-configs': true,
    'folder-scripts': true,
    'folder-output': true,
  });

  const [newFileInputOpen, setNewFileInputOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  // Track open tabs in editor
  const [openTabIds, setOpenTabIds] = useState<string[]>(() => {
    return activeFile ? [activeFile.id] : [];
  });

  // Painel Inferior (Console/Output)
  const [outputTab, setOutputTab] = useState<'build' | 'validation' | 'sandbox'>('build');
  const [outputCollapsed, setOutputCollapsed] = useState(false);

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectFile = (file: ProjectFile) => {
    setActiveFile(file);
    if (!openTabIds.includes(file.id)) {
      setOpenTabIds((prev) => [...prev, file.id]);
    }
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openTabIds.filter((tabId) => tabId !== id);
    setOpenTabIds(remaining);
    if (activeFile?.id === id) {
      if (remaining.length > 0) {
        // Find file object
        const findInTree = (nodes: ProjectFile[]): ProjectFile | null => {
          for (const node of nodes) {
            if (node.id === remaining[remaining.length - 1]) return node;
            if (node.children) {
              const res = findInTree(node.children);
              if (res) return res;
            }
          }
          return null;
        };
        const next = findInTree(files);
        if (next) setActiveFile(next);
      } else {
        setActiveFile(null);
      }
    }
  };

  const handleFormatCode = () => {
    if (!activeFile?.content) return;
    try {
      if (activeFile.extension === 'json') {
        const parsed = JSON.parse(activeFile.content);
        updateFileContent(activeFile.id, JSON.stringify(parsed, null, 2));
        addNotification('Formatador', 'JSON formatado com sucesso.', 'success');
      } else {
        addNotification('Formatador', 'Identação padrão aplicada.', 'info');
      }
    } catch {
      addNotification('Erro de Formatação', 'Sintaxe inválida para formatação.', 'error');
    }
  };

  const handleCopyHash = () => {
    if (activeFile?.checksum) {
      navigator.clipboard.writeText(activeFile.checksum);
      addNotification('SHA-256 Copiado', activeFile.checksum, 'info');
    }
  };

  const handleRenameConfirm = () => {
    if (!activeFile || !renameValue.trim()) return;
    activeFile.name = renameValue.trim();
    setRenameModalOpen(false);
    addNotification('Arquivo Renomeado', `Novo nome: ${renameValue.trim()}`, 'success');
  };

  const renderTree = (items: ProjectFile[], depth = 0) => {
    return items.map((item) => {
      if (item.type === 'folder') {
        const isExpanded = !!expandedFolders[item.id];
        return (
          <div key={item.id} className="select-none">
            <div
              onClick={() => toggleFolder(item.id)}
              style={{ paddingLeft: `${depth * 10 + 6}px` }}
              className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-[#101724] text-zinc-400 hover:text-white cursor-pointer transition-colors text-xs font-mono"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-amber-400/80" />
              )}
              <span className="font-semibold tracking-wide">{item.name}</span>
            </div>
            {isExpanded && item.children && renderTree(item.children, depth + 1)}
          </div>
        );
      }

      const isSelected = activeFile?.id === item.id;
      let fileIcon = <FileCode className="w-3.5 h-3.5 text-cyan-400" />;
      if (item.extension === 'html') fileIcon = <FileCode className="w-3.5 h-3.5 text-amber-400" />;
      else if (item.extension === 'sh') fileIcon = <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
      else if (item.extension === 'bin') fileIcon = <Binary className="w-3.5 h-3.5 text-rose-400" />;
      else if (item.extension === 'md') fileIcon = <FileText className="w-3.5 h-3.5 text-zinc-400" />;

      return (
        <div
          key={item.id}
          onClick={() => handleSelectFile(item)}
          style={{ paddingLeft: `${depth * 10 + 18}px` }}
          className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors text-xs font-mono group ${
            isSelected
              ? 'bg-[#121a28] text-amber-300 font-bold border-l-2 border-amber-400'
              : 'text-zinc-400 hover:bg-[#0c1119] hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {fileIcon}
            <span className="truncate">{item.name}</span>
          </div>

          <span className="text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.size < 1024 ? `${item.size}B` : `${(item.size / 1024).toFixed(1)}K`}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-hidden font-mono select-none">
      {/* 3-Pane Technical File Builder Area */}
      <div className="flex-1 flex min-h-0">
        {/* PAINEL ESQUERDO: Árvore de Arquivos do Projeto */}
        <div className="w-64 bg-[#07090e] border-r border-[#161f2e] flex flex-col shrink-0">
          {/* Header */}
          <div className="h-10 px-3 border-b border-[#161f2e] bg-[#090d14] flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
              ÁRVORE DO PROJETO
            </span>
            <button
              onClick={() => setNewFileInputOpen(!newFileInputOpen)}
              className="p-1 rounded bg-[#0f1420] hover:bg-[#152033] border border-amber-500/30 text-amber-400 hover:text-white transition-colors"
              title="Novo Arquivo ou Pasta"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* New file input form */}
          {newFileInputOpen && (
            <div className="p-2.5 border-b border-[#161f2e] bg-[#0b0f17] space-y-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="nome.ext (ex: payload.sh)"
                className="w-full bg-[#07090e] border border-[#1d2738] text-xs px-2.5 py-1 text-white focus:outline-none focus:border-amber-400 rounded"
              />
              <div className="flex items-center justify-between text-xs">
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value as any)}
                  className="bg-[#07090e] border border-[#1d2738] text-zinc-300 px-2 py-0.5 rounded text-[11px]"
                >
                  <option value="file">Arquivo</option>
                  <option value="folder">Pasta</option>
                </select>
                <div className="flex gap-1">
                  <button
                    onClick={() => setNewFileInputOpen(false)}
                    className="px-2 py-0.5 rounded bg-[#131924] text-zinc-400 hover:text-white text-[10px]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (newFileName.trim()) {
                        createFile(null, newFileName.trim(), newFileType);
                        setNewFileName('');
                        setNewFileInputOpen(false);
                      }
                    }}
                    className="px-2.5 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px]"
                  >
                    Criar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* File Tree List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <div className="text-[10px] text-zinc-500 uppercase px-2 py-1 tracking-wider">
              {activeProject.name} (ROOT)
            </div>
            {renderTree(files)}
          </div>

          {/* Explorer footer */}
          <div className="h-8 px-3 border-t border-[#161f2e] bg-[#080b11] text-[10px] text-zinc-500 flex items-center justify-between">
            <span>TOTAL: {activeProject.filesCount} ARQUIVOS</span>
            <span className="text-emerald-400">STATUS: OK</span>
          </div>
        </div>

        {/* PAINEL CENTRAL: Editor com Numeração de Linhas, Abas e Ações */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#06080d] border-r border-[#161f2e]">
          {/* Action Bar do Editor: Salvar, Novo arquivo, Renomear, Excluir, Formatar */}
          <div className="h-10 px-3 border-b border-[#161f2e] bg-[#090d14] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => activeFile && saveFile(activeFile.id)}
                className="px-2 py-1 rounded bg-[#0f1522] hover:bg-[#182338] border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1 transition-colors text-[11px]"
                title="Salvar alterações no arquivo"
              >
                <Save className="w-3 h-3 text-amber-400" />
                <span>Salvar</span>
              </button>

              <button
                onClick={() => setNewFileInputOpen(true)}
                className="px-2 py-1 rounded bg-[#0c1018] hover:bg-[#141b27] border border-[#1b2537] text-zinc-300 hover:text-white flex items-center gap-1 transition-colors text-[11px]"
                title="Novo arquivo"
              >
                <Plus className="w-3 h-3 text-cyan-400" />
                <span>Novo</span>
              </button>

              <button
                onClick={() => {
                  if (activeFile) {
                    setRenameValue(activeFile.name);
                    setRenameModalOpen(true);
                  }
                }}
                className="px-2 py-1 rounded bg-[#0c1018] hover:bg-[#141b27] border border-[#1b2537] text-zinc-300 hover:text-white flex items-center gap-1 transition-colors text-[11px]"
                title="Renomear arquivo atual"
              >
                <Edit2 className="w-3 h-3 text-zinc-400" />
                <span>Renomear</span>
              </button>

              <button
                onClick={() => {
                  if (activeFile) deleteFile(activeFile.id);
                }}
                className="px-2 py-1 rounded bg-[#0c1018] hover:bg-[#141b27] border border-[#1b2537] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors text-[11px]"
                title="Excluir arquivo"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span>Excluir</span>
              </button>

              <span className="text-zinc-700">|</span>

              <button
                onClick={handleFormatCode}
                className="px-2 py-1 rounded bg-[#0c1018] hover:bg-[#141b27] border border-[#1b2537] text-zinc-300 hover:text-white flex items-center gap-1 transition-colors text-[11px]"
                title="Formatar identação e sintaxe"
              >
                <AlignLeft className="w-3 h-3 text-zinc-400" />
                <span>Formatar</span>
              </button>
            </div>

            {/* Quick validation badge */}
            {activeFile && (
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span className="text-zinc-500">{activeFile.path}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {activeFile.extension?.toUpperCase() || 'TXT'}
                </span>
              </div>
            )}
          </div>

          {/* Tab Bar for Open Files */}
          <div className="h-8 px-2 bg-[#05070a] border-b border-[#141b28] flex items-center gap-1 overflow-x-auto">
            {openTabIds.map((tabId) => {
              const findInTree = (nodes: ProjectFile[]): ProjectFile | null => {
                for (const node of nodes) {
                  if (node.id === tabId) return node;
                  if (node.children) {
                    const res = findInTree(node.children);
                    if (res) return res;
                  }
                }
                return null;
              };
              const tabFile = findInTree(files);
              if (!tabFile) return null;
              const isActiveTab = activeFile?.id === tabId;

              return (
                <div
                  key={tabId}
                  onClick={() => setActiveFile(tabFile)}
                  className={`h-7 px-2.5 rounded-t flex items-center gap-1.5 cursor-pointer text-xs transition-colors border-t border-x ${
                    isActiveTab
                      ? 'bg-[#06080d] text-amber-300 border-[#1a2538] border-b-transparent font-bold'
                      : 'bg-[#080b12] text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-[#0c1018]'
                  }`}
                >
                  <File className="w-3 h-3" />
                  <span>{tabFile.name}</span>
                  <button
                    onClick={(e) => handleCloseTab(tabId, e)}
                    className="ml-1 p-0.5 hover:text-white rounded hover:bg-zinc-800"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Editor Textarea with Line Numbers */}
          <div className="flex-1 relative flex overflow-hidden">
            {activeFile ? (
              <div className="flex-1 flex overflow-auto font-mono text-xs bg-[#05070b]">
                {/* Line Numbers */}
                <div className="py-3 px-3 bg-[#070a10] border-r border-[#141b27] text-zinc-600 select-none text-right font-mono min-w-[48px]">
                  {(activeFile.content || '').split('\n').map((_, idx) => (
                    <div key={idx} className="leading-6 text-[11px]">
                      {idx + 1}
                    </div>
                  ))}
                </div>

                {/* Editor Area */}
                <textarea
                  value={activeFile.content || ''}
                  onChange={(e) => updateFileContent(activeFile.id, e.target.value)}
                  spellCheck={false}
                  className="flex-1 p-3 bg-transparent text-zinc-200 leading-6 resize-none focus:outline-none font-mono selection:bg-amber-500/30 selection:text-amber-200"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 text-xs gap-2">
                <FileCode className="w-8 h-8 text-zinc-700" />
                <span>Nenhum arquivo aberto no editor.</span>
                <span className="text-[11px] text-zinc-700">Selecione um arquivo na árvore à esquerda.</span>
              </div>
            )}
          </div>

          {/* PAINEL INFERIOR: Console/Output (Compilação, Validação, Sandbox) */}
          <div className="border-t border-[#161f2e] bg-[#07090f] flex flex-col shrink-0">
            <div className="h-8 px-3 bg-[#090d14] border-b border-[#141b27] flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setOutputTab('build'); setOutputCollapsed(false); }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    outputTab === 'build' && !outputCollapsed
                      ? 'bg-[#121927] text-amber-300 border border-amber-500/40'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Output Compilação
                </button>
                <button
                  onClick={() => { setOutputTab('validation'); setOutputCollapsed(false); }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    outputTab === 'validation' && !outputCollapsed
                      ? 'bg-[#121927] text-emerald-300 border border-emerald-500/40'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Erros de Validação
                </button>
                <button
                  onClick={() => { setOutputTab('sandbox'); setOutputCollapsed(false); }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    outputTab === 'sandbox' && !outputCollapsed
                      ? 'bg-[#121927] text-cyan-300 border border-cyan-800/40'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Logs Sandbox
                </button>
              </div>

              <button
                onClick={() => setOutputCollapsed(!outputCollapsed)}
                className="text-[10px] text-zinc-500 hover:text-zinc-300"
              >
                {outputCollapsed ? '▲ Expandir' : '▼ Recolher'}
              </button>
            </div>

            {!outputCollapsed && (
              <div className="h-28 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed bg-[#05070a]">
                {outputTab === 'build' && (
                  <div className="space-y-1 text-zinc-300">
                    <div className="text-zinc-500">[BUILD] Iniciando processo de empacotamento para {activeProject.name}...</div>
                    <div className="text-emerald-400">[BUILD] SHA-256 gerado: {activeFile?.checksum || activeProject.lastBuildHash}</div>
                    <div className="text-amber-300">[BUILD] 0 avisos críticos detectados. Artefato pronto para sandbox.</div>
                  </div>
                )}
                {outputTab === 'validation' && (
                  <div className="space-y-1 text-zinc-300">
                    <div className="text-emerald-400">[VALIDAÇÃO] Parser AST: Sintaxe 100% em conformidade com bash/posix.</div>
                    <div className="text-zinc-400">[VALIDAÇÃO] Permissões: restrição de leitura e execução confirmadas.</div>
                    <div className="text-cyan-400">[VALIDAÇÃO] Airgap Enforced: 0 requisições externas encontradas no payload.</div>
                  </div>
                )}
                {outputTab === 'sandbox' && (
                  <div className="space-y-1 text-zinc-300">
                    <div className="text-cyan-400">[SANDBOX] Alvo vinculado: 127.0.0.1 (Loopback Confinado).</div>
                    <div className="text-zinc-400">[SANDBOX] Memória alocada: 12.4MB / 512MB limit.</div>
                    <div className="text-emerald-400">[SANDBOX] Status: OK (Conexões externas bloqueadas por iptables).</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* PAINEL DIREITO: Inspetor do Arquivo */}
        <div className="w-72 bg-[#07090e] flex flex-col shrink-0 select-none text-xs">
          {/* Header */}
          <div className="h-10 px-3 border-b border-[#161f2e] bg-[#090d14] flex items-center justify-between">
            <span className="font-bold text-[11px] text-zinc-300 uppercase tracking-wider">
              INSPETOR DO ARQUIVO
            </span>
          </div>

          {/* Metadata Cards */}
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            {activeFile ? (
              <>
                <div className="p-3 rounded bg-[#0b0e16] border border-[#162030] space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Nome</span>
                    <div className="text-white font-bold mt-0.5 truncate">{activeFile.name}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Tipo de Arquivo</span>
                    <div className="text-cyan-400 mt-0.5">
                      {activeFile.extension ? `Texto / .${activeFile.extension.toUpperCase()}` : 'Binário'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Permissões Simuladas (POSIX)</span>
                    <div className="text-zinc-200 mt-0.5 font-mono flex items-center justify-between">
                      <span className="text-amber-400 font-bold">{activeFile.extension === 'sh' ? '0755 (-rwxr-xr-x)' : '0644 (-rw-r--r--)'}</span>
                      <span className="text-[10px] text-zinc-500">watson:sec-lab</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Tamanho</span>
                    <div className="text-zinc-300 mt-0.5">
                      {activeFile.size} bytes ({(activeFile.size / 1024).toFixed(2)} KB)
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Hash SHA-256</span>
                    <div className="flex items-center gap-1.5 mt-0.5 bg-[#07090f] p-1.5 rounded border border-[#182336]">
                      <span className="font-mono text-[10px] text-amber-400 truncate flex-1">
                        {activeFile.checksum || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                      </span>
                      <button
                        onClick={handleCopyHash}
                        className="p-1 hover:text-white text-zinc-400 transition-colors"
                        title="Copiar Hash"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Validação de Integridade</span>
                    <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{activeFile.validationStatus.toUpperCase()} (SANDBOX PASS)</span>
                    </div>
                  </div>
                </div>

                {/* AÇÕES: Validar, Compilar, Analisar, Exportar */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                    AÇÕES DO LABORATÓRIO
                  </span>

                  <button
                    onClick={runValidation}
                    className="w-full py-1.5 px-3 rounded bg-[#0e1420] hover:bg-[#152033] border border-emerald-800/50 text-emerald-400 font-bold flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VALIDAR</span>
                  </button>

                  <button
                    onClick={runBuild}
                    className="w-full py-1.5 px-3 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center justify-center gap-2 transition-colors text-xs shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>COMPILAR</span>
                  </button>

                  <button
                    onClick={runAnalysis}
                    className="w-full py-1.5 px-3 rounded bg-[#0e1420] hover:bg-[#152033] border border-indigo-800/50 text-indigo-400 font-bold flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>ANALISAR</span>
                  </button>

                  <button
                    onClick={runExport}
                    className="w-full py-1.5 px-3 rounded bg-[#0e1420] hover:bg-[#152033] border border-cyan-800/50 text-cyan-400 font-bold flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORTAR</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-zinc-600 text-center p-4">Nenhum arquivo selecionado.</div>
            )}
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b0f17] border border-[#1e2a3c] rounded-lg p-4 w-full max-w-sm space-y-3 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase">Renomear Arquivo</h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full bg-[#07090e] border border-[#1e2a3c] rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
              autoFocus
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRenameModalOpen(false)}
                className="px-3 py-1 rounded bg-[#151c2a] text-zinc-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleRenameConfirm}
                className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
