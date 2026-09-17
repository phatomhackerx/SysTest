export interface SocioInfo {
  nome: string;
  qualificacao: string;
  paisOrigem: string;
  representanteLegal?: string;
  faixaEtaria?: string;
}

export interface CnaeInfo {
  codigo: string;
  descricao: string;
}

export interface CorporateDossier {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacaoCadastral: 'ATIVA' | 'INAPTA' | 'BAIXADA' | 'SUSPENSA';
  dataSituacao: string;
  dataAbertura: string;
  porte: 'ME' | 'EPP' | 'DEMAIS';
  naturezaJuridica: string;
  capitalSocial: number;
  simplesNacional: boolean;
  simplesDesde?: string;
  simei: boolean;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cep: string;
    municipio: string;
    uf: string;
  };
  contato: {
    telefone: string;
    email: string;
  };
  cnaePrincipal: CnaeInfo;
  cnaesSecundarios: CnaeInfo[];
  qsa: SocioInfo[];
  compliance: {
    score: number; // 0-100
    riscoGeral: 'BAIXO' | 'MÉDIO' | 'ALTO';
    processosAtivos: number;
    sancoesPublicas: boolean;
    pepEnvolvido: boolean;
  };
}

export const SAMPLE_DOSSIERS: Record<string, CorporateDossier> = {
  '00.000.000/0000-00': {
    cnpj: '00.000.000/0000-00',
    razaoSocial: 'WATSON INTELLIGENCE & CYBER LABS LTDA',
    nomeFantasia: 'SR WATSON CORPORATE SECURITY',
    situacaoCadastral: 'ATIVA',
    dataSituacao: '12/03/2021',
    dataAbertura: '10/01/2018',
    porte: 'DEMAIS',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    capitalSocial: 12500000.0,
    simplesNacional: false,
    simei: false,
    endereco: {
      logradouro: 'Avenida Brigadeiro Faria Lima',
      numero: '3477',
      complemento: 'Andar 14 - Torre Sul',
      bairro: 'Itaim Bibi',
      cep: '04538-133',
      municipio: 'São Paulo',
      uf: 'SP',
    },
    contato: {
      telefone: '(11) 3045-8900',
      email: 'investigacao@srwatson.com.br',
    },
    cnaePrincipal: {
      codigo: '62.09-1-00',
      descricao: 'Suporte técnico, manutenção e outros serviços em tecnologia da informação e cibersegurança',
    },
    cnaesSecundarios: [
      { codigo: '62.01-1-01', descricao: 'Desenvolvimento de programas de computador sob encomenda' },
      { codigo: '63.11-9-00', descricao: 'Tratamento de dados, provedores de serviços de aplicação e hospedagem na internet' },
      { codigo: '80.20-0-01', descricao: 'Atividades de monitoramento de sistemas de segurança eletrônicos e inteligência' },
    ],
    qsa: [
      {
        nome: 'ARTHUR CONAN DOYLE NETO',
        qualificacao: '49 - Sócio-Administrador',
        paisOrigem: 'BRASIL',
        faixaEtaria: '41 a 50 anos',
      },
      {
        nome: 'SHERLOCK HOLMES CONSULTING LLC',
        qualificacao: '22 - Sócio Pessoa Jurídica Domiciliada no Exterior',
        paisOrigem: 'REINO UNIDO',
        representanteLegal: 'JOHN H. WATSON',
      },
      {
        nome: 'DR. JOHN HAMISH WATSON',
        qualificacao: '05 - Administrador',
        paisOrigem: 'BRASIL',
        faixaEtaria: '51 a 60 anos',
      },
    ],
    compliance: {
      score: 98,
      riscoGeral: 'BAIXO',
      processosAtivos: 0,
      sancoesPublicas: false,
      pepEnvolvido: false,
    },
  },
  '33.000.167/0001-01': {
    cnpj: '33.000.167/0001-01',
    razaoSocial: 'PETROLEO BRASILEIRO S.A. - PETROBRAS',
    nomeFantasia: 'PETROBRAS',
    situacaoCadastral: 'ATIVA',
    dataSituacao: '03/11/2005',
    dataAbertura: '03/10/1953',
    porte: 'DEMAIS',
    naturezaJuridica: '203-8 - Sociedade de Economia Mista',
    capitalSocial: 205431960000.0,
    simplesNacional: false,
    simei: false,
    endereco: {
      logradouro: 'Avenida República do Chile',
      numero: '65',
      bairro: 'Centro',
      cep: '20031-912',
      municipio: 'Rio de Janeiro',
      uf: 'RJ',
    },
    contato: {
      telefone: '(21) 3224-4477',
      email: 'relacionamentoinvestidores@petrobras.com.br',
    },
    cnaePrincipal: {
      codigo: '19.21-7-00',
      descricao: 'Fabricação de produtos do refino de petróleo',
    },
    cnaesSecundarios: [
      { codigo: '06.00-0-01', descricao: 'Extração de petróleo e gás natural' },
      { codigo: '35.11-5-01', descricao: 'Geração de energia elétrica' },
    ],
    qsa: [
      {
        nome: 'MAGDA MARIA DE REGINA CHAMBRIARD',
        qualificacao: '10 - Diretor Presidente',
        paisOrigem: 'BRASIL',
        faixaEtaria: '61 a 70 anos',
      },
      {
        nome: 'UNIAO FEDERAL',
        qualificacao: '24 - Sócio Controlador / Ente Público',
        paisOrigem: 'BRASIL',
      },
    ],
    compliance: {
      score: 91,
      riscoGeral: 'BAIXO',
      processosAtivos: 42,
      sancoesPublicas: false,
      pepEnvolvido: true,
    },
  },
  '06.990.590/0001-23': {
    cnpj: '06.990.590/0001-23',
    razaoSocial: 'GOOGLE BRASIL INTERNET LTDA.',
    nomeFantasia: 'GOOGLE BRASIL',
    situacaoCadastral: 'ATIVA',
    dataSituacao: '09/03/2005',
    dataAbertura: '09/03/2005',
    porte: 'DEMAIS',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    capitalSocial: 450000000.0,
    simplesNacional: false,
    simei: false,
    endereco: {
      logradouro: 'Avenida Brigadeiro Faria Lima',
      numero: '3477',
      complemento: 'Andar 18 ao 20',
      bairro: 'Itaim Bibi',
      cep: '04538-133',
      municipio: 'São Paulo',
      uf: 'SP',
    },
    contato: {
      telefone: '(11) 2395-8400',
      email: 'juridicobrasil@google.com',
    },
    cnaePrincipal: {
      codigo: '63.19-4-00',
      descricao: 'Portais, provedores de conteúdo e outros serviços de informação na internet',
    },
    cnaesSecundarios: [
      { codigo: '73.12-2-00', descricao: 'Agenciamento de espaços para publicidade, exceto em veículos de comunicação' },
      { codigo: '62.02-3-00', descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis' },
    ],
    qsa: [
      {
        nome: 'GOOGLE LLC',
        qualificacao: '22 - Sócio Pessoa Jurídica Domiciliada no Exterior',
        paisOrigem: 'ESTADOS UNIDOS',
        representanteLegal: 'FABIO JOSE SILVA COELHO',
      },
      {
        nome: 'FABIO JOSE SILVA COELHO',
        qualificacao: '05 - Administrador',
        paisOrigem: 'BRASIL',
        faixaEtaria: '51 a 60 anos',
      },
    ],
    compliance: {
      score: 95,
      riscoGeral: 'BAIXO',
      processosAtivos: 18,
      sancoesPublicas: false,
      pepEnvolvido: false,
    },
  },
};

export function searchCorporateDatabase(query: string): CorporateDossier {
  const cleanDigits = query.replace(/\D/g, '');
  
  for (const [key, dossier] of Object.entries(SAMPLE_DOSSIERS)) {
    if (key.replace(/\D/g, '') === cleanDigits || key.toLowerCase().includes(query.toLowerCase()) || dossier.razaoSocial.toLowerCase().includes(query.toLowerCase()) || dossier.nomeFantasia.toLowerCase().includes(query.toLowerCase())) {
      return dossier;
    }
  }

  // Generate an authentic synthetic dossier for arbitrary CNPJ/query
  const formatted = cleanDigits.length === 14 
    ? cleanDigits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
    : (query.trim() || '44.821.903/0001-44');

  return {
    cnpj: formatted,
    razaoSocial: `${query.toUpperCase() || 'ALVO INVESTIGADO'} SERVIÇOS & TECNOLOGIA LTDA`,
    nomeFantasia: `${query.toUpperCase() || 'ALVO CORP'} INVESTIGAÇÃO`,
    situacaoCadastral: 'ATIVA',
    dataSituacao: '15/05/2020',
    dataAbertura: '10/02/2016',
    porte: 'DEMAIS',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    capitalSocial: 1800000.0,
    simplesNacional: false,
    simei: false,
    endereco: {
      logradouro: 'Avenida Paulista',
      numero: '1000',
      complemento: 'Conjunto 101',
      bairro: 'Bela Vista',
      cep: '01310-100',
      municipio: 'São Paulo',
      uf: 'SP',
    },
    contato: {
      telefone: '(11) 3284-9000',
      email: 'contato@investigado.com.br',
    },
    cnaePrincipal: {
      codigo: '62.09-1-00',
      descricao: 'Serviços de tecnologia da informação e consultoria de dados',
    },
    cnaesSecundarios: [
      { codigo: '74.90-1-04', descricao: 'Atividades de intermediação e agenciamento de serviços e negócios' },
      { codigo: '63.11-9-00', descricao: 'Tratamento de dados, provedores de aplicação e hospedagem' },
    ],
    qsa: [
      {
        nome: 'CARLOS EDUARDO DE MENEZES',
        qualificacao: '49 - Sócio-Administrador',
        paisOrigem: 'BRASIL',
        faixaEtaria: '41 a 50 anos',
      },
      {
        nome: 'MARIANA SILVEIRA FONTES',
        qualificacao: '22 - Sócia',
        paisOrigem: 'BRASIL',
        faixaEtaria: '31 a 40 anos',
      },
    ],
    compliance: {
      score: 87,
      riscoGeral: 'BAIXO',
      processosAtivos: 2,
      sancoesPublicas: false,
      pepEnvolvido: false,
    },
  };
}
