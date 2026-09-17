import React, { useState, useMemo } from 'react';
import { useWatson } from '../../context/WatsonContext';
import {
  Layers,
  FileCode,
  Save,
  Send,
  CheckCircle2,
  Code2,
  Layout,
  Variable,
  Eye,
  Shield,
  AlertTriangle,
  Server,
  FileCheck,
  Terminal,
  Activity,
  Copy,
} from 'lucide-react';

type TemplateCategory =
  | 'Phishing Simulation'
  | 'Security Awareness'
  | 'Data Validation'
  | 'Network Test'
  | 'Audit Script';

interface TemplatePreset {
  id: string;
  category: TemplateCategory;
  name: string;
  description: string;
  code: string;
}

const PRESETS: TemplatePreset[] = [
  {
    id: 'phish-sim-01',
    category: 'Phishing Simulation',
    name: 'Alerta de Redefinição de Credenciais (Simulação)',
    description: 'Template educativo simulando comunicado interno de redefinição mandatória de senha corporativa.',
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Simulação de Segurança - {{company}}</title>
  <style>
    body { font-family: sans-serif; background: #0b0f17; color: #e2e8f0; padding: 24px; }
    .card { background: #131b28; border: 1px solid #1e293b; padding: 20px; border-radius: 8px; max-width: 520px; margin: auto; }
    .badge { background: #d97706; color: #000; padding: 3px 8px; font-weight: bold; border-radius: 4px; font-size: 11px; }
    .btn { background: #f59e0b; color: #000; font-weight: bold; padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">SIMULAÇÃO CONTROLADA [{{campaign_id}}]</span>
    <h2>Aviso de Segurança: {{company}}</h2>
    <p>Olá <strong>{{target_name}}</strong> (Estação: {{target_ip}}),</p>
    <p>Um acesso não reconhecido tentou sincronizar os certificados da sua conta. Por política de segurança, revalide suas credenciais em ambiente de testes.</p>
    <a href="#" class="btn">Revalidar em Sandbox</a>
    <p style="font-size: 11px; color: #94a3b8; margin-top: 20px;">
      Alvo: {{target_name}} | Payload: {{custom_payload}}
    </p>
  </div>
</body>
</html>`,
  },
  {
    id: 'sec-aware-01',
    category: 'Security Awareness',
    name: 'Boletim Interno: Política de Senhas Fortes',
    description: 'Comunicação institucional de conscientização com regras de entropia e verificação em duas etapas.',
    code: `# BOLETIM DE CONSCIENTIZAÇÃO EM SEGURANÇA
Organização: {{company}}
Identificador de Campanha: {{campaign_id}}
Destinatário / Estação: {{target_name}} (IP: {{target_ip}})

## Diretrizes de Proteção Corporativa
1. Nunca compartilhe credenciais via canais não criptografados.
2. Certifique-se de que a autenticação multifator (MFA) está ativa.
3. Teste de conformidade técnica associado: {{custom_payload}}

Laboratório Autorizado - SysTest v2.4`,
  },
  {
    id: 'data-val-01',
    category: 'Data Validation',
    name: 'Schema Validator: Sanitização de Payload JSON',
    description: 'Validador estruturado para testar integridade de campos e hashes de payloads recebidos.',
    code: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DataValidation_{{campaign_id}}",
  "target": {
    "name": "{{target_name}}",
    "ip": "{{target_ip}}",
    "organization": "{{company}}"
  },
  "payloadVerification": {
    "command": "{{custom_payload}}",
    "expectedExitCode": 0,
    "airgapPolicyEnforced": true
  }
}`,
  },
  {
    id: 'net-test-01',
    category: 'Network Test',
    name: 'Script de Sondagem de Portas Locais (Sandbox)',
    description: 'Sondagem controlada de serviços locais rodando no alvo especificado.',
    code: `#!/usr/bin/env bash
# Teste de Rede Local Sandbox
# Alvo: {{target_name}} | IP: {{target_ip}} | Campanha: {{campaign_id}}
echo "[*] Iniciando sondagem de integridade em {{target_ip}}..."
echo "[*] Organização: {{company}}"
echo "[*] Executando comando de validação: {{custom_payload}}"
nc -zv -w 2 {{target_ip}} 80 443 8080 8888
echo "[+] Concluído com sucesso no ambiente SysTest."`,
  },
  {
    id: 'audit-01',
    category: 'Audit Script',
    name: 'Auditoria de Conformidade e Permissões',
    description: 'Script para verificação de privilégios e permissões no host alvo do laboratório.',
    code: `#!/usr/bin/env bash
# Auditoria de Conformidade SysTest
# ID: {{campaign_id}} | Host: {{target_name}} ({{target_ip}})
echo "=== SysTest Security Audit ==="
echo "Target: {{target_name}} | {{target_ip}}"
echo "Company: {{company}}"
echo "Testing: {{custom_payload}}"
find /tmp /var/tmp -type f -perm -0002 2>/dev/null
echo "[+] Auditoria finalizada."`,
  },
];

export const TemplateBuilderView: React.FC = () => {
  const { createFile, runBuild, addNotification, activeTarget } = useWatson();

  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('Phishing Simulation');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('phish-sim-01');

  // Structured Form Variables
  const [variables, setVariables] = useState({
    target_name: 'LAB-TARGET-01',
    target_ip: '127.0.0.1',
    company: 'Empresa Demo Corp',
    campaign_id: 'CAMP-2026-A1',
    custom_payload: 'systest-agent --verify-auth --strict',
  });

  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('code');
  const [customCode, setCustomCode] = useState<string>(PRESETS[0].code);

  const categories: { id: TemplateCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'Phishing Simulation', label: 'Phishing Simulation', icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
    { id: 'Security Awareness', label: 'Security Awareness', icon: <Shield className="w-4 h-4 text-cyan-400" /> },
    { id: 'Data Validation', label: 'Data Validation', icon: <FileCheck className="w-4 h-4 text-emerald-400" /> },
    { id: 'Network Test', label: 'Network Test', icon: <Server className="w-4 h-4 text-indigo-400" /> },
    { id: 'Audit Script', label: 'Audit Script', icon: <Terminal className="w-4 h-4 text-rose-400" /> },
  ];

  const handleSelectPreset = (preset: TemplatePreset) => {
    setSelectedPresetId(preset.id);
    setSelectedCategory(preset.category);
    setCustomCode(preset.code);
  };

  // Replaced real-time preview text
  const evaluatedOutput = useMemo(() => {
    let text = customCode;
    text = text.replace(/\{\{target_name\}\}/g, variables.target_name);
    text = text.replace(/\{\{target_ip\}\}/g, variables.target_ip);
    text = text.replace(/\{\{company\}\}/g, variables.company);
    text = text.replace(/\{\{campaign_id\}\}/g, variables.campaign_id);
    text = text.replace(/\{\{custom_payload\}\}/g, variables.custom_payload);
    return text;
  }, [customCode, variables]);

  // Action: Salvar Template
  const handleSaveTemplate = () => {
    addNotification('Template Salvo', `Template "${selectedPresetId}" atualizado com sucesso.`, 'success');
  };

  // Action: Gerar Arquivo
  const handleGenerateFile = () => {
    const ext = customCode.startsWith('<!DOCTYPE') || customCode.startsWith('<html') ? 'html' : customCode.startsWith('{') ? 'json' : 'sh';
    const fileName = `template_${variables.campaign_id.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`;
    createFile(null, fileName, 'file');
    addNotification('Arquivo Gerado', `${fileName} foi criado na árvore de arquivos do projeto.`, 'success');
  };

  // Action: Enviar para Lab
  const handleSendToLab = () => {
    runBuild();
    addNotification('Enviado para o Lab', `Artefato despachado para o sandbox no alvo ${activeTarget.name}`, 'info');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-hidden font-mono select-none">
      {/* 3-Panel Main Layout */}
      <div className="flex-1 flex min-h-0">
        {/* PAINEL DE CATEGORIAS (Esquerdo) */}
        <div className="w-64 bg-[#07090e] border-r border-[#161f2e] flex flex-col shrink-0">
          <div className="h-10 px-3 border-b border-[#161f2e] bg-[#090d14] flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
              CATEGORIAS DE TEMPLATE
            </span>
          </div>

          <div className="p-2 space-y-1 overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const firstOfCat = PRESETS.find((p) => p.category === cat.id);
                  if (firstOfCat) handleSelectPreset(firstOfCat);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-colors text-left ${
                  selectedCategory === cat.id
                    ? 'bg-[#121927] text-white font-bold border border-amber-500/40 text-amber-300'
                    : 'text-zinc-400 hover:bg-[#0b0f17] hover:text-white'
                }`}
              >
                {cat.icon}
                <span className="text-xs truncate">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="px-3 pt-3 pb-1 border-t border-[#161f2e] text-[10px] text-zinc-500 uppercase font-bold">
            PRESETS DISPONÍVEIS
          </div>

          <div className="flex-1 p-2 space-y-1 overflow-y-auto">
            {PRESETS.filter((p) => p.category === selectedCategory).map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`w-full p-2 rounded text-left border transition-colors ${
                  selectedPresetId === preset.id
                    ? 'bg-[#101726] border-amber-500/40 text-amber-300'
                    : 'bg-[#090d14] border-[#141c2b] text-zinc-400 hover:text-white hover:bg-[#0d131f]'
                }`}
              >
                <div className="font-bold text-xs truncate">{preset.name}</div>
                <div className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* PAINEL CENTRAL: Formulário Estruturado de Variáveis + Editor Visual / Código */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#06080d] border-r border-[#161f2e]">
          {/* Header with Mode Switcher */}
          <div className="h-10 px-4 border-b border-[#161f2e] bg-[#090d14] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase text-[11px]">
                VARIÁVEIS & ESTRUTURA DO TEMPLATE
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#05070a] p-0.5 rounded border border-[#182336] text-[11px]">
              <button
                onClick={() => setEditorMode('code')}
                className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  editorMode === 'code' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Editor Código</span>
              </button>
              <button
                onClick={() => setEditorMode('visual')}
                className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  editorMode === 'visual' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layout className="w-3 h-3" />
                <span>Visual</span>
              </button>
            </div>
          </div>

          {/* Variables Configuration Ribbon */}
          <div className="p-3 bg-[#080c14] border-b border-[#141c2b] space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
              <Variable className="w-3.5 h-3.5" />
              <span>VARIÁVEIS DINÂMICAS DO TEMPLATE</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              <div>
                <label className="text-[10px] text-zinc-500 block font-bold">{'{{target_name}}'}</label>
                <input
                  type="text"
                  value={variables.target_name}
                  onChange={(e) => setVariables({ ...variables, target_name: e.target.value })}
                  className="w-full bg-[#05070b] border border-[#162030] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block font-bold">{'{{target_ip}}'}</label>
                <input
                  type="text"
                  value={variables.target_ip}
                  onChange={(e) => setVariables({ ...variables, target_ip: e.target.value })}
                  className="w-full bg-[#05070b] border border-[#162030] rounded px-2 py-1 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block font-bold">{'{{company}}'}</label>
                <input
                  type="text"
                  value={variables.company}
                  onChange={(e) => setVariables({ ...variables, company: e.target.value })}
                  className="w-full bg-[#05070b] border border-[#162030] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block font-bold">{'{{campaign_id}}'}</label>
                <input
                  type="text"
                  value={variables.campaign_id}
                  onChange={(e) => setVariables({ ...variables, campaign_id: e.target.value })}
                  className="w-full bg-[#05070b] border border-[#162030] rounded px-2 py-1 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <label className="text-[10px] text-zinc-500 block font-bold">{'{{custom_payload}}'}</label>
                <input
                  type="text"
                  value={variables.custom_payload}
                  onChange={(e) => setVariables({ ...variables, custom_payload: e.target.value })}
                  className="w-full bg-[#05070b] border border-[#162030] rounded px-2 py-1 text-xs text-emerald-300 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Central Workspace: Visual or Code */}
          <div className="flex-1 relative flex overflow-hidden">
            {editorMode === 'code' ? (
              <textarea
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full p-4 bg-[#05070a] text-zinc-200 leading-6 resize-none focus:outline-none font-mono text-xs selection:bg-amber-500/30 selection:text-amber-200"
              />
            ) : (
              <div className="w-full h-full p-5 overflow-y-auto space-y-3 bg-[#06080e]">
                <div className="p-3 bg-[#090d15] border border-[#182336] rounded-lg">
                  <span className="text-amber-400 font-bold text-xs uppercase block mb-1">
                    Visual Blocks Inspector
                  </span>
                  <p className="text-xs text-zinc-400">
                    O template está configurado com 5 pontos de injeção dinâmica. Os blocos visuais utilizam o motor de renderização sandbox isolado.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#080b12] border border-[#161f2e] rounded-lg">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Categoria Ativa</span>
                    <div className="text-white font-bold text-sm mt-1">{selectedCategory}</div>
                  </div>
                  <div className="p-3 bg-[#080b12] border border-[#161f2e] rounded-lg">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Substituições Pendentes</span>
                    <div className="text-emerald-400 font-bold text-sm mt-1">5 Variáveis Mapeadas</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PAINEL LATERAL (Direito): Preview em Tempo Real + Ações */}
        <div className="w-80 bg-[#07090e] flex flex-col shrink-0 select-none text-xs">
          <div className="h-10 px-3 border-b border-[#161f2e] bg-[#090d14] flex items-center justify-between">
            <span className="font-bold text-[11px] text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>PREVIEW EM TEMPO REAL</span>
            </span>
          </div>

          {/* Evaluated Output Preview */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            <div className="p-3 bg-[#040608] border border-[#162030] rounded-lg font-mono text-[11px] text-zinc-300 whitespace-pre-wrap break-all leading-relaxed max-h-[380px] overflow-y-auto">
              {evaluatedOutput}
            </div>

            <div className="p-2.5 bg-[#090d14] border border-[#161f2e] rounded text-[10px] text-zinc-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>Alvo Vinculado:</span>
                <span className="text-cyan-400 font-bold">{activeTarget.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sanitização:</span>
                <span className="text-emerald-400 font-bold">AIRGAP STRICT</span>
              </div>
            </div>

            {/* Ações: Salvar Template, Gerar Arquivo, Enviar para Lab */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleSaveTemplate}
                className="w-full py-2 px-3 rounded bg-[#0e1420] hover:bg-[#152033] border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center gap-2 transition-colors text-xs"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>SALVAR TEMPLATE</span>
              </button>

              <button
                onClick={handleGenerateFile}
                className="w-full py-2 px-3 rounded bg-[#0e1420] hover:bg-[#152033] border border-cyan-800/40 text-cyan-300 font-bold flex items-center justify-center gap-2 transition-colors text-xs"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>GERAR ARQUIVO</span>
              </button>

              <button
                onClick={handleSendToLab}
                className="w-full py-2 px-3 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center justify-center gap-2 transition-colors text-xs shadow-sm"
              >
                <Send className="w-3.5 h-3.5 fill-black" />
                <span>ENVIAR PARA LAB</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
