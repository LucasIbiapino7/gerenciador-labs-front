import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Feature from "../components/Landing/Feature"

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="mb-4 max-w-3xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Portal de Laboratórios do <span className="text-primary">CCET / UFMA</span>
        </h1>
        <p className="mb-8 max-w-xl text-lg text-gray-600">
          Centralize projetos, eventos e materiais dos grupos de pesquisa em um só lugar.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={login}
            className="rounded-md bg-primary px-6 py-2 font-medium text-white hover:bg-primary/90"
          >
            Entrar
          </button>
          <a
            href="/register"
            className="rounded-md border border-primary px-6 py-2 font-medium text-primary hover:bg-primary/5"
          >
            Registrar-se
          </a>
          <button
            onClick={() => navigate('/labs')}
            className="rounded-md px-6 py-2 font-medium text-gray-700 hover:bg-gray-200/60"
          >
            Continuar como visitante
          </button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 pt-12 sm:grid-cols-2 lg:grid-cols-3">
        <Feature icon="📰" title="Feed integrado">
          Acompanhe atualizações de todos os laboratórios em tempo real.
        </Feature>
        <Feature icon="📅" title="Agenda de eventos">
          Não perca defesas, workshops e reuniões importantes.
        </Feature>
        <Feature icon="📂" title="Materiais centralizados">
          Artigos, slides e datasets acessíveis em um clique.
        </Feature>
      </section>
      <footer className="bg-gray-900 px-4 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} CCET / UFMA · Projeto acadêmico.
      </footer>
    </div>
  );
}
