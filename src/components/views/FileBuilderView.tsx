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
  Eye,
  ChevronRight,
  ChevronDown,
  Terminal,
  Binary,
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
    runPreview,
    activeProject,
    activeTarget,
  } = useWatson();

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'folder-assets': true,
    'folder-templates': true,
    'folder-configs': true,
    'folder-scripts': true,
    'folder-output': true,
  });

  const [bottomTab, setBottomTab] = useState<'build-log' | 'hex' | 'manifest'>('build-log');
  const [newFileInputOpen, setNewFileInputOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTree = (items: ProjectFile[], depth = 0) => {
    return items.map((item) => {
      if (item.type === 'folder') {
        const isExpanded = !!expandedFolders[item.id];
        return (
          <div key={item.id} className="select-none">
            <div
              onClick={() => toggleFolder(item.id)}
              style={{ paddingLeft: `${depth * 12 + 6}px` }}
              className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-[#121824] text-zinc-400 hover:text-white cursor-pointer transition-colors text-xs font-mono"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-amber-400" />
              ) : (
                <Folder className="w-4 h-4 text-amber-400/80" />
              )}
              <span className="font-medium tracking-wide">{item.name}</span>
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
          onClick={() => setActiveFile(item)}
          style={{ paddingLeft: `${depth * 12 + 20}px` }}
          className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-colors text-xs font-mono group ${
            isSelected
              ? 'bg-[#151d2c] text-amber-300 font-semibold border-l-2 border-amber-400'
              : 'text-zinc-400 hover:bg-[#101520] hover:text-zinc-200'
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
    <div className="flex-1 flex flex-col h-full bg-black overflow-hidden font-sans">
      {/* Main 3-Pane Area */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT: Project Explorer */}
        <div className="w-64 bg-[#080b12] border-r border-[#18202f] flex flex-col shrink-0 select-none">
          {/* Explorer Header */}
          <div className="px-4 py-3 border-b border-[#18202f] bg-[#0c1018] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-white tracking-wide uppercase">EXPLORADOR DE ARQUIVOS</span>
            </div>
            <button
              onClick={() => setNewFileInputOpen(!newFileInputOpen)}
              className="p-1.5 rounded-lg hover:bg-[#151c2a] text-zinc-400 hover:text-white transition-colors"
              title="Adicionar Arquivo ou Pasta"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

          {/* New file input form if toggled */}
          {newFileInputOpen && (
            <div className="p-3 border-b border-[#18202f] bg-[#0e131d] space-y-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="nome.ext (ex: script.sh)"
                className="w-full bg-[#07090f] border border-[#1d2638] text-xs font-mono px-3 py-1.5 text-white focus:outline-none focus:border-amber-400 rounded-xl"
              />
              <div className="flex items-center justify-between text-xs font-mono">
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value as any)}
                  className="bg-[#07090f] border border-[#1d2638] text-zinc-300 px-2 py-1 rounded-lg"
                >
                  <option value="file">Arquivo</option>
                  <option value="folder">Pasta</option>
                </select>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setNewFileInputOpen(false)}
                    className="px-2.5 py-1 rounded-full bg-[#151c2a] text-zinc-400 hover:text-white text-[11px]"
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
                    className="px-3 py-1 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-[11px]"
                  >
                    Criar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Root Directory Tree */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <div className="text-[10px] font-mono text-zinc-600 uppercase px-2 py-1 tracking-wider">
              {activeProject.name} (RAIZ)
            </div>
            {renderTree(files)}
          </div>

          {/* Quick Target Link in Explorer Footer */}
          <div className="p-3 border-t border-[#18202f] bg-[#0c1018] text-xs font-mono text-zinc-500 flex items-center justify-between">
            <span>Alvo Vinculado:</span>
            <span className="text-cyan-400 font-semibold">{activeTarget.name}</span>
          </div>
        </div>

        {/* CENTER: Editor Pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#06080d] border-r border-[#18202f]">
          {/* Top Bar: File, Edit, Format, Validate, Build, Preview */}
          <div className="h-12 px-4 border-b border-[#18202f] bg-[#090c13] flex items-center justify-between select-none">
            {/* Action Menu Strip */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => activeFile && saveFile(activeFile.id)}
                className="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#121824] transition-colors"
              >
                Arquivo
              </button>
              <button
                onClick={() => {
                  if (activeFile && activeFile.content) {
                    navigator.clipboard.writeText(activeFile.content);
                  }
                }}
                className="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#121824] transition-colors"
              >
                Copiar
              </button>
              <button
                onClick={() => {
                  if (activeFile?.content) {
                    try {
                      if (activeFile.extension === 'json') {
                        const parsed = JSON.parse(activeFile.content);
                        updateFileContent(activeFile.id, JSON.stringify(parsed, null, 2));
                      }
                    } catch {}
                  }
                }}
                className="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#121824] transition-colors"
              >
                Formatar
              </button>
              <span className="text-zinc-700">|</span>
              <button
                onClick={runValidation}
                className="px-3 py-1 rounded-full bg-[#101724] hover:bg-[#182234] border border-emerald-800/40 text-emerald-400 transition-colors flex items-center gap-1.5 font-semibold text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validar</span>
              </button>
              <button
                onClick={runBuild}
                className="px-3 py-1 rounded-full bg-[#101724] hover:bg-[#182234] border border-amber-500/40 text-amber-400 transition-colors flex items-center gap-1.5 font-semibold text-xs"
              >
                <Play className="w-3.5 h-3.5 fill-amber-400/20" />
                <span>Compilar</span>
              </button>
              <button
                onClick={runPreview}
                className="px-3 py-1 rounded-full bg-[#101724] hover:bg-[#182234] border border-cyan-800/40 text-cyan-400 transition-colors flex items-center gap-1.5 font-semibold text-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            {/* Active file breadcrumb & badge */}
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              {activeFile ? (
                <>
                  <span className="text-white font-medium">{activeFile.path}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#151d2c] text-amber-400 border border-amber-500/30">
                    {activeFile.extension ? activeFile.extension.toUpperCase() : 'TXT'}
                  </span>
                </>
              ) : (
                <span>Nenhum arquivo selecionado</span>
              )}
            </div>
          </div>

          {/* Code Textarea Area */}
          <div className="flex-1 relative flex overflow-hidden">
            {activeFile ? (
              <div className="flex-1 flex overflow-auto font-mono text-xs bg-[#05070b]">
                {/* Line Numbers */}
                <div className="py-4 px-3 bg-[#07090f] border-r border-[#151c2a] text-zinc-600 select-none text-right font-mono min-w-[48px]">
                  {(activeFile.content || '').split('\n').map((_, idx) => (
                    <div key={idx} className="leading-6">
                      {idx + 1}
                    </div>
                  ))}
                </div>

                {/* Editor Textarea */}
                <textarea
                  value={activeFile.content || ''}
                  onChange={(e) => updateFileContent(activeFile.id, e.target.value)}
                  spellCheck={false}
                  className="flex-1 p-4 bg-transparent text-zinc-200 leading-6 resize-none focus:outline-none font-mono selection:bg-amber-500/30 selection:text-amber-200"
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs font-mono text-zinc-600">
                Selecione um arquivo no Explorador para editar
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: File Properties Inspector */}
        <div className="w-72 bg-[#080b12] flex flex-col shrink-0 select-none font-mono text-xs">
          {/* Properties Header */}
          <div className="px-4 py-3 border-b border-[#18202f] bg-[#0c1018]">
            <span className="font-bold text-xs text-white tracking-wide uppercase">PROPRIEDADES</span>
          </div>

          {/* Properties List */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {activeFile ? (
              <>
                <div className="p-3 rounded-xl bg-[#0e131d] border border-[#1a2232] space-y-2.5">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Nome</span>
                    <div className="text-zinc-200 font-semibold truncate mt-0.5">{activeFile.name}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Tipo</span>
                    <div className="text-cyan-400 mt-0.5">
                      {activeFile.extension ? `Texto / ${activeFile.extension.toUpperCase()}` : 'Binário / Pacote'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Tamanho</span>
                    <div className="text-zinc-300 mt-0.5">
                      {activeFile.size} bytes ({(activeFile.size / 1024).toFixed(2)} KB)
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Codificação</span>
                    <div className="text-zinc-300 mt-0.5">{activeFile.encoding}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Permissões</span>
                    <div className="text-amber-300 font-semibold mt-0.5">{activeFile.permissions} (chmod 0644)</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Validação</span>
                    <div className="text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{activeFile.validationStatus.toUpperCase()} (Sandbox)</span>
                    </div>
                  </div>
                </div>

                {/* Primary Inspector Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => saveFile(activeFile.id)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)] font-mono text-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>SALVAR ARQUIVO</span>
                  </button>

                  <button
                    onClick={runValidation}
                    className="w-full py-2 px-4 rounded-full bg-[#111724] hover:bg-[#1a2336] border border-emerald-800/40 text-emerald-300 font-semibold flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>VALIDAR</span>
                  </button>

                  <button
                    onClick={runBuild}
                    className="w-full py-2 px-4 rounded-full bg-[#111724] hover:bg-[#1a2336] border border-amber-500/40 text-amber-300 font-semibold flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    <Play className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                    <span>COMPILAR</span>
                  </button>

                  <button
                    onClick={runPreview}
                    className="w-full py-2 px-4 rounded-full bg-[#111724] hover:bg-[#1a2336] border border-cyan-800/40 text-cyan-300 font-semibold flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>PREVIEW</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-zinc-600 text-center p-4">Nenhum arquivo ativo.</div>
            )}
          </div>

          {/* Delete File button */}
          {activeFile && (
            <div className="p-3 border-t border-[#18202f] bg-[#0c1018]">
              <button
                onClick={() => deleteFile(activeFile.id)}
                className="w-full py-1 text-center text-xs text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir do workspace</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM: Terminal / Build Output Panel */}
      <div className="h-44 bg-[#05070a] border-t border-[#18202f] flex flex-col shrink-0 font-mono text-xs">
        {/* Output Tabs Header */}
        <div className="h-9 px-4 bg-[#090c13] border-b border-[#18202f] flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBottomTab('build-log')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                bottomTab === 'build-log'
                  ? 'bg-[#141c2b] text-amber-300 border border-amber-500/30 font-medium'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Terminal / Saída do Build
            </button>
            <button
              onClick={() => setBottomTab('hex')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                bottomTab === 'hex'
                  ? 'bg-[#141c2b] text-amber-300 border border-amber-500/30 font-medium'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Inspetor Hex
            </button>
            <button
              onClick={() => setBottomTab('manifest')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                bottomTab === 'manifest'
                  ? 'bg-[#141c2b] text-amber-300 border border-amber-500/30 font-medium'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Manifesto de Confinamento Sandbox
            </button>
          </div>

          <div className="text-[10px] text-zinc-500">
            <span>AIRGAP: 127.0.0.1:8888</span>
          </div>
        </div>

        {/* Output Console Body */}
        <div className="flex-1 overflow-y-auto p-4 text-xs leading-relaxed">
          {bottomTab === 'build-log' && (
            <div className="space-y-1 font-mono">
              <div className="text-zinc-500">[14:32:08] Iniciando compilação no pipeline automatizado Watson...</div>
              <div className="text-zinc-300">[14:32:09] Arquivo fonte: {activeFile?.path || 'templates/credential_audit_drill.html'}</div>
              <div className="text-cyan-400">[14:32:09] Validação de sintaxe HTML5 em sandbox estrita concluída.</div>
              <div className="text-cyan-400">[14:32:10] Higienização de rotas: todos os destinos de requisição restritos ao sink local.</div>
              <div className="text-amber-400">[14:32:10] Checksum SHA-256 = 8e4f1a23b9d0c8741e2a849f7e5102ab</div>
              <div className="text-emerald-400 font-semibold">[14:32:11] STATUS DO BUILD: SUCESSO. Artefato gerado em output/watson_drill_artifact.bin</div>
            </div>
          )}

          {bottomTab === 'hex' && (
            <pre className="text-cyan-300/90 text-xs font-mono">
              {`00000000: 5741 5453 4f4e 2d53 4543 2d50 4b47 2d56  WATSON-SEC-PKG-V\n00000010: 3234 0000 7f00 0001 22b8 0000 e2a4 91b0  24......".......\n00000020: 8e4f 1a23 b9d0 c874 1e2a 849f 7e51 02ab  .O.#...t.*..~Q..\n00000030: 0000 0001 0000 0100 0000 0008 0000 0000  ................\n00000040: 6175 7468 2d64 7269 6c6c 2d73 696d 756c  auth-drill-simul\n00000050: 6174 696f 6e2d 746f 6b65 6e2d 3430 3200  ation-token-402.`}
            </pre>
          )}

          {bottomTab === 'manifest' && (
            <div className="text-zinc-300 space-y-1 font-mono">
              <div><span className="text-amber-400">cgroup_memory_limit:</span> 512MB [APLICADO]</div>
              <div><span className="text-amber-400">network_namespaces:</span> Bridge virtual isolada TAP (10.240.0.0/24)</div>
              <div><span className="text-amber-400">capabilities:</span> ALL_DROPPED (CAP_NET_BIND_SERVICE retido)</div>
              <div><span className="text-emerald-400 font-semibold">[PASS]</span> Nenhum vetor de escalonamento de privilégios detectado.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
