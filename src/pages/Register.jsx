import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ nome: '', email: '', password: '' });

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviar registro', form);
  };


  const isValid = form.nome && form.email && form.password.length >= 6;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-center text-2xl font-bold text-primary">Criar conta</h1>

        <button
          onClick={login}
          className="flex w-full items-center justify-center gap-3 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FcGoogle className="h-5 w-5" /> Entrar com Google
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="flex-1 border-t border-gray-100" />
          ou
          <span className="flex-1 border-t border-gray-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Nome completo</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">E-mail</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Senha</label>
            <input
              name="password"
              type="password"
              placeholder="mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className="w-full rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Registrar
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <a href="/login" className="text-primary hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}
