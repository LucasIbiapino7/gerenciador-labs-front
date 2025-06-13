import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockProfile = {
  nome: 'Aluno',
  bio: 'Bio apenas para teste',
  github_url: 'https://github.com/',
  linkedin_url: 'https://www.linkedin.com/in/',
  link_lattes: 'http://lattes.cnpq.br/',
  photoUrl: '',
};

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(mockProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Salvar perfil', form);
    navigate('/me');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Editar perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Nome</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">GitHub</label>
            <input
              name="github_url"
              type="url"
              value={form.github_url}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">LinkedIn</label>
            <input
              name="linkedin_url"
              type="url"
              value={form.linkedin_url}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Lattes</label>
            <input
              name="link_lattes"
              type="url"
              value={form.link_lattes}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/me')}
            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
