import React from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Heading,
  Type,
  MousePointerClick,
  FormInput,
  Image as ImageIcon,
  Table as TableIcon,
  Code2,
  AlertTriangle,
  Activity,
  Plus,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle2,
  Download,
  Shield,
  Layers,
} from 'lucide-react';
import { TemplateComponent } from '../../types';

export const TemplateBuilderView: React.FC = () => {
  const {
    templateComponents,
    selectedTemplateComponentId,
    setSelectedTemplateComponentId,
    addTemplateComponent,
    updateTemplateComponent,
    removeTemplateComponent,
    moveTemplateComponent,
    duplicateTemplateComponent,
    runPreview,
    runValidation,
    runExport,
  } = useWatson();

  const paletteItems: {
    type: TemplateComponent['type'];
    label: string;
    icon: React.ReactNode;
    desc: string;
  }[] = [
    { type: 'Header', label: 'Cabeçalho', icon: <Heading className="w-4 h-4 text-amber-400" />, desc: 'Banner & logotipo institucional' },
    { type: 'Text', label: 'Texto', icon: <Type className="w-4 h-4 text-zinc-300" />, desc: 'Parágrafo instrutivo de conscientização' },
    { type: 'Button', label: 'Botão', icon: <MousePointerClick className="w-4 h-4 text-cyan-400" />, desc: 'Disparador ou ação de resposta' },
    { type: 'Form', label: 'Formulário', icon: <FormInput className="w-4 h-4 text-amber-400" />, desc: 'Simulação de credencial em sandbox' },
    { type: 'Image', label: 'Imagem', icon: <ImageIcon className="w-4 h-4 text-zinc-400" />, desc: 'Crachá ou marca corporativa' },
    { type: 'Table', label: 'Tabela', icon: <TableIcon className="w-4 h-4 text-cyan-400" />, desc: 'Checklist de matriz ou telemetria' },
    { type: 'Code Block', label: 'Bloco de Código', icon: <Code2 className="w-4 h-4 text-emerald-400" />, desc: 'Script e instrução técnica' },
    { type: 'Warning', label: 'Aviso', icon: <AlertTriangle className="w-4 h-4 text-amber-400" />, desc: 'Notificação de simulação segura' },
    { type: 'Status', label: 'Status', icon: <Activity className="w-4 h-4 text-emerald-400" />, desc: 'Indicador de sandbox em loopback' },
  ];

  const selectedItem = templateComponents.find((c) => c.id === selectedTemplateComponentId);

  return (
    <div className="flex-1 flex flex-col h-full bg-black overflow-hidden font-sans text-zinc-300">
      {/* Disclaimer Banner */}
      <div className="px-6 py-2.5 bg-[#090c13] border-b border-amber-500/20 flex items-center justify-between text-amber-300 select-none">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold tracking-wide text-xs">
            AMBIENTE DE LABORATÓRIO AUTORIZADO: Templates projetados estritamente para conscientização e testes controlados.
          </span>
        </div>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold">
          AIRGAP ATIVO
        </span>
      </div>

      {/* Top Action Bar */}
      <div className="h-14 px-6 border-b border-[#18202f] bg-[#090c13] flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">AÇÕES:</span>
          <button
            onClick={() => selectedTemplateComponentId && duplicateTemplateComponent(selectedTemplateComponentId)}
            disabled={!selectedTemplateComponentId}
            className="px-3 py-1.5 rounded-full bg-[#101724] hover:bg-[#182234] text-zinc-300 border border-[#1e2738] flex items-center gap-1.5 disabled:opacity-30 transition-colors text-xs"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span>DUPLICAR</span>
          </button>
          <button
            onClick={() => selectedTemplateComponentId && removeTemplateComponent(selectedTemplateComponentId)}
            disabled={!selectedTemplateComponentId}
            className="px-3 py-1.5 rounded-full bg-[#101724] hover:bg-[#182234] text-rose-300 border border-[#1e2738] flex items-center gap-1.5 disabled:opacity-30 transition-colors text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>EXCLUIR</span>
          </button>
          <button
            onClick={() => selectedTemplateComponentId && moveTemplateComponent(selectedTemplateComponentId, 'up')}
            disabled={!selectedTemplateComponentId}
            className="p-1.5 rounded-full bg-[#101724] hover:bg-[#182234] text-zinc-300 border border-[#1e2738] disabled:opacity-30 transition-colors"
            title="Mover para cima"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => selectedTemplateComponentId && moveTemplateComponent(selectedTemplateComponentId, 'down')}
            disabled={!selectedTemplateComponentId}
            className="p-1.5 rounded-full bg-[#101724] hover:bg-[#182234] text-zinc-300 border border-[#1e2738] disabled:opacity-30 transition-colors"
            title="Mover para baixo"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={runPreview}
            className="px-3.5 py-1.5 rounded-full bg-[#101724] hover:bg-[#182234] text-cyan-300 border border-cyan-800/40 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>PREVIEW</span>
          </button>
          <button
            onClick={runValidation}
            className="px-3.5 py-1.5 rounded-full bg-[#101724] hover:bg-[#182234] text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>VALIDAR</span>
          </button>
          <button
            onClick={runExport}
            className="px-4 py-1.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORTAR</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Split */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT: Components Palette */}
        <div className="w-64 bg-[#080b12] border-r border-[#18202f] flex flex-col shrink-0 select-none">
          <div className="px-4 py-3 border-b border-[#18202f] bg-[#0c1018]">
            <span className="font-bold text-xs text-white tracking-wide uppercase font-mono">COMPONENTES</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {paletteItems.map((item) => (
              <button
                key={item.type}
                onClick={() => addTemplateComponent(item.type)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0e131d] hover:bg-[#151c2a] border border-[#1a2232] hover:border-amber-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#141b27] border border-[#1e2738]">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-amber-300 text-xs">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-zinc-500">{item.desc}</div>
                  </div>
                </div>
                <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-[#18202f] bg-[#0c1018] text-[11px] text-zinc-500">
            Clique no componente para anexar à tela de composição.
          </div>
        </div>

        {/* CENTER: Composition Canvas */}
        <div className="flex-1 bg-black watson-grid-bg p-6 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-2xl bg-[#0b0e15] border border-[#1a2232] rounded-2xl shadow-2xl overflow-hidden">
            {/* Canvas Header Bar */}
            <div className="px-5 py-3 bg-[#0e121a] border-b border-[#18202f] flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs font-mono uppercase">TELA DE COMPOSIÇÃO</span>
                <span className="text-[10px] text-zinc-500 font-mono">({templateComponents.length} itens)</span>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">127.0.0.1:8888 SANDBOX</span>
            </div>

            {/* Components Stack */}
            <div className="p-6 space-y-4">
              {templateComponents.length === 0 ? (
                <div className="p-10 border-2 border-dashed border-[#1a2232] rounded-2xl text-center text-zinc-500 font-mono text-xs">
                  A tela está vazia. Adicione componentes da paleta lateral para montar o template.
                </div>
              ) : (
                templateComponents.map((cmp, idx) => {
                  const isSelected = selectedTemplateComponentId === cmp.id;
                  return (
                    <div
                      key={cmp.id}
                      onClick={() => setSelectedTemplateComponentId(cmp.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'border-amber-400 bg-[#121927] shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/40'
                          : 'border-[#18202e] bg-[#080b11] hover:border-[#253247]'
                      }`}
                    >
                      {/* Component badge */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#151c2a] text-[10px] font-mono text-zinc-500">
                        <span className="font-semibold text-amber-400">
                          #{idx + 1} [{cmp.type.toUpperCase()}] {cmp.label}
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 text-zinc-400 transition-opacity">
                          Clique para inspecionar
                        </span>
                      </div>

                      {/* Render Visual Representation */}
                      {cmp.type === 'Header' && (
                        <div>
                          <h2 className="text-base font-bold text-white font-sans">{cmp.properties.title || 'Título do Cabeçalho'}</h2>
                          {cmp.properties.caption && (
                            <p className="text-xs text-zinc-400 mt-1">{cmp.properties.caption}</p>
                          )}
                        </div>
                      )}

                      {cmp.type === 'Warning' && (
                        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 flex items-center gap-2.5 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{cmp.properties.content || 'Texto de alerta de segurança'}</span>
                        </div>
                      )}

                      {cmp.type === 'Text' && (
                        <p className="text-zinc-300 leading-relaxed text-xs">
                          {cmp.properties.content || 'Parágrafo descritivo de conscientização.'}
                        </p>
                      )}

                      {cmp.type === 'Form' && (
                        <div className="space-y-2.5 bg-[#05070a] p-3.5 rounded-xl border border-[#18202f]">
                          {(cmp.properties.fields || ['field_1', 'field_2']).map((f, fIdx) => (
                            <div key={fIdx} className="space-y-1">
                              <label className="text-[10px] text-zinc-400 font-mono">{f}</label>
                              <div className="h-8 w-full bg-[#0c1018] rounded-lg border border-[#1d2638] px-2.5 flex items-center text-zinc-600 text-xs font-mono">
                                [campo simulado de teste]
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {cmp.type === 'Button' && (
                        <div>
                          <button className="px-4 py-2 bg-[#f59e0b] text-black font-bold rounded-full text-xs pointer-events-none shadow-md">
                            {cmp.properties.title || 'Ação do Botão'}
                          </button>
                        </div>
                      )}

                      {cmp.type === 'Code Block' && (
                        <pre className="p-3 bg-[#05070a] border border-[#18202f] rounded-xl text-emerald-400 text-xs font-mono overflow-x-auto">
                          <code>{cmp.properties.content || 'echo "[+] simulacao watson"'}</code>
                        </pre>
                      )}

                      {cmp.type === 'Status' && (
                        <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          <span>{cmp.properties.state || 'Sandbox Ativa'}</span>
                        </div>
                      )}

                      {cmp.type === 'Table' && (
                        <div className="border border-[#18202f] rounded-xl overflow-hidden text-xs">
                          <div className="bg-[#0e131d] p-2 font-semibold text-white flex justify-between font-mono">
                            <span>{cmp.properties.caption || 'Checklist de Vetores'}</span>
                            <span className="text-cyan-400">STATUS</span>
                          </div>
                          <div className="p-3 text-zinc-400 space-y-1.5 bg-[#05070a] font-mono text-[11px]">
                            <div className="flex justify-between"><span>RFC-1122 Loopback</span><span className="text-emerald-400">APLICADO</span></div>
                            <div className="flex justify-between"><span>Egress Externo</span><span className="text-rose-400">BLOQUEADO</span></div>
                          </div>
                        </div>
                      )}

                      {cmp.type === 'Image' && (
                        <div className="h-20 bg-[#05070a] border border-dashed border-[#1d2638] rounded-xl flex items-center justify-center text-zinc-500 gap-2 text-xs">
                          <ImageIcon className="w-4 h-4 text-amber-400/70" />
                          <span>Container de Imagem / Logotipo</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Properties Inspector */}
        <div className="w-80 bg-[#080b12] border-l border-[#18202f] flex flex-col shrink-0 select-none">
          <div className="px-4 py-3 border-b border-[#18202f] bg-[#0c1018]">
            <span className="font-bold text-xs text-white tracking-wide uppercase font-mono">INSPETOR DE PROPRIEDADES</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {selectedItem ? (
              <div className="space-y-3.5">
                <div className="p-3 rounded-xl bg-[#0e131d] border border-[#1a2232]">
                  <span className="text-[10px] text-zinc-500 uppercase">Elemento Ativo</span>
                  <div className="font-bold text-amber-400 mt-0.5 font-sans text-sm">{selectedItem.label}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">ID: {selectedItem.id}</div>
                </div>

                {/* Properties Inputs */}
                {selectedItem.properties.title !== undefined && (
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase mb-1">Título / Texto:</label>
                    <input
                      type="text"
                      value={selectedItem.properties.title}
                      onChange={(e) => updateTemplateComponent(selectedItem.id, { title: e.target.value })}
                      className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-sans text-xs"
                    />
                  </div>
                )}

                {selectedItem.properties.caption !== undefined && (
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase mb-1">Subtítulo:</label>
                    <input
                      type="text"
                      value={selectedItem.properties.caption}
                      onChange={(e) => updateTemplateComponent(selectedItem.id, { caption: e.target.value })}
                      className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-sans text-xs"
                    />
                  </div>
                )}

                {selectedItem.properties.content !== undefined && (
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase mb-1">Corpo de Conteúdo:</label>
                    <textarea
                      rows={4}
                      value={selectedItem.properties.content}
                      onChange={(e) => updateTemplateComponent(selectedItem.id, { content: e.target.value })}
                      className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-sans text-xs"
                    />
                  </div>
                )}

                {selectedItem.properties.action !== undefined && (
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase mb-1">Rota de Destino (Action):</label>
                    <input
                      type="text"
                      value={selectedItem.properties.action}
                      onChange={(e) => updateTemplateComponent(selectedItem.id, { action: e.target.value })}
                      className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
                    />
                  </div>
                )}

                {selectedItem.properties.state !== undefined && (
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase mb-1">Rótulo de Status:</label>
                    <input
                      type="text"
                      value={selectedItem.properties.state}
                      onChange={(e) => updateTemplateComponent(selectedItem.id, { state: e.target.value })}
                      className="w-full bg-[#07090f] border border-[#1d2638] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
                    />
                  </div>
                )}

                <div className="pt-2 border-t border-[#18202f] space-y-2">
                  <span className="text-[10px] text-zinc-500 uppercase">Operações do Componente</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => duplicateTemplateComponent(selectedItem.id)}
                      className="py-2 px-3 rounded-full bg-[#111724] hover:bg-[#1a2336] text-cyan-300 border border-[#1e2738] text-center transition-colors text-xs"
                    >
                      Duplicar
                    </button>
                    <button
                      onClick={() => removeTemplateComponent(selectedItem.id)}
                      className="py-2 px-3 rounded-full bg-[#111724] hover:bg-[#1a2336] text-rose-400 border border-[#1e2738] text-center transition-colors text-xs"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-zinc-600 text-center py-10 font-sans text-xs">
                Selecione um componente na tela de composição para editar suas propriedades.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
