import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Feature from "../components/Landing/Feature"

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section com imagem de fundo */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Imagem de fundo cobrindo toda a área */}
        <div className="absolute inset-0 bg-[url('C:\Users\Lorena\Documents\Multab\gerenciador-labs-front\src\img\Gemini_Generated_Image_1bmt971bmt971bmt.png')] bg-cover bg-center"></div>
        
        {/* Overlay escuro para melhor contraste */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Conteúdo principal */}
        <div className="relative z-10">
          <h1 className="mb-6 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mx-auto">
            Portal de Laboratórios do <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">CCET / UFMA</span>
          </h1>
          <p className="mb-10 max-w-xl text-xl text-blue-100 leading-relaxed mx-auto">
            Centralize projetos, eventos e materiais dos grupos de pesquisa em um só lugar.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={login}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            >
              Entrar
            </button>
            <a
              href="/register"
              className="rounded-lg border-2 border-blue-400 px-8 py-3 font-semibold text-blue-100 bg-white/10 backdrop-blur-sm shadow-md hover:bg-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            >
              Registrar-se
            </a>
            <button
              onClick={() => navigate('/labs')}
              className="rounded-lg px-8 py-3 font-semibold text-white bg-blue-600/80 shadow-md hover:bg-blue-700 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            >
              Continuar como visitante
            </button>
          </div>
          
        
        </div>
      </section>
      

      

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-10 text-center text-gray-300">
        <div className="max-w-6xl mx-auto">
          <p className="mb-2">© {new Date().getFullYear()} CCET / UFMA · Projeto acadêmico</p>
          <p className="text-xs opacity-70">Desenvolvido com React e Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}