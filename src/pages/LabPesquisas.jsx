import { useState } from 'react';
import PesquisaCard from '../components/Pesquisa/PesquisaCard';

const mockPesquisas = [
  {
    id: 1,
    titulo: 'Análise de Microserviços em Ambiente Acadêmico',
    ano: 2024,
    tipo: 'ARTIGO',
    resumo: 'Estudo de caso sobre adoção de arquitetura de microserviços em aplicativos universitários.',
    url: 'https://example.com/artigo1.pdf',
    autores: ['Profa. Daniela', 'Ana Beatriz'],
  },
  {
    id: 2,
    titulo: 'Orientação de TCC: Ferramentas de Observabilidade',
    ano: 2023,
    tipo: 'ORIENTACAO',
    resumo: '',
    url: '',
    autores: ['Prof. Carlos'],
  },
  {
    id: 3,
    titulo: 'Projeto Integrador: Plataforma Wanda',
    ano: 2025,
    tipo: 'PROJETO',
    resumo: 'Desenvolvimento de plataforma gamificada para ensino de programação.',
    url: 'https://github.com/ufma-labs/wanda',
    autores: ['Rafael Costa', 'Ana Beatriz'],
  },
];

export default function LabPesquisas() {
  const [pesquisas] = useState(mockPesquisas);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold text-primary">Pesquisas do Laboratório</h1>
      {pesquisas.map((p) => (
        <PesquisaCard key={p.id} item={p} />
      ))}
    </div>
  );
}
