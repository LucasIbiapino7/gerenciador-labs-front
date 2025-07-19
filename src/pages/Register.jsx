import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../services/AuthService';

export default function Register() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // limpa erro pontual ao alterar
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    setGlobalError(null);
  }

  const isValid =
    form.nome.trim().length >= 2 &&
    form.nome.trim().length <= 50 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.password.length >= 8 &&
    form.password.length <= 30;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setFieldErrors({});
    setGlobalError(null);
    setSuccess(false);

    try {
      await registerUser(form);
      setSuccess(true);
    } catch (err) {
      const status = err.response?.status;

      if (status === 422) {
        const list = err.response?.data?.errors || [];
        const map = {};
        list.forEach(e => {
          if (e.fieldName) map[e.fieldName] = e.message;
        });
        setFieldErrors(map);
        setGlobalError('Corrija os campos destacados.');
      } else if (status === 400) {
        const msg = err.response?.data?.message;
        if (msg && msg.toLowerCase().includes('invalid email')) {
          setFieldErrors(prev => ({ ...prev, email: 'E-mail já utilizado.' }));
          setGlobalError('E-mail já cadastrado.');
        } else {
          setGlobalError(msg || 'Não foi possível concluir o registro (400).');
        }
      } else {
        setGlobalError(
          'Falha inesperada ao registrar. Tente novamente mais tarde.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-center text-2xl font-bold text-primary">
          Criar conta
        </h1>

        {success ? (
          <div className="space-y-6">
            <div className="rounded border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Registro concluído! Clique em <strong>Fazer login</strong> para autenticar-se
              e começar a usar a plataforma.
            </div>
            <button
              onClick={login}
              className="w-full rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Fazer login
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={login}
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              disabled={submitting}
              aria-label="Entrar com Google"
            >
              <FcGoogle className="h-5 w-5" />
              Entrar com Google
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex-1 border-t border-gray-100" />
              ou
              <span className="flex-1 border-t border-gray-100" />
            </div>

            {globalError && (
              <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
                {globalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nome completo
                </label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:border-primary ${
                    fieldErrors.name || fieldErrors.nome
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                />
                {(fieldErrors.name || fieldErrors.nome) && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.name || fieldErrors.nome}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">E-mail</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:border-primary ${
                    fieldErrors.email ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Senha</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="8 a 30 caracteres"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className={`w-full rounded border px-3 py-2 pr-20 text-sm focus:outline-none focus:border-primary ${
                      fieldErrors.password
                        ? 'border-red-400'
                        : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute inset-y-0 right-2 flex items-center text-xs font-medium text-primary hover:underline"
                    tabIndex={-1}
                  >
                    {showPass ? 'ocultar' : 'mostrar'}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
                {!fieldErrors.password && (
                  <p className="mt-1 text-[11px] text-gray-500">
                    A senha deve ter entre 8 e 30 caracteres.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || submitting}
                className="w-full rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? 'Registrando…' : 'Registrar'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Já tem conta?{' '}
              <Link
                to="/login"
                onClick={(e) => { e.preventDefault(); login(); }}
                className="text-primary hover:underline"
              >
                Entrar
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
