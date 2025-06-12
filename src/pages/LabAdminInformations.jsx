import { useState } from 'react';
import { Pencil, Save, X, Upload } from 'lucide-react';
import Gradients from '../utils/Gradients';

const initial = {
  nome: 'LabSoft',
  descricao_curta: 'Engenharia de Software e IA.',
  descricao_longa: 'Pesquisamos técnicas de desenvolvimento ...',
  foto_url: '/logos/labsoft.png',
  banner: 'from-emerald-600 to-emerald-400',
};

export default function AdminInfoTab() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initial);
  const [preview, setPreview] = useState(initial.foto_url);

  const handleSave = () => {
    console.log('PUT /labs/:id', form);
    setEditing(false);
  };

  const handleFile = (e) => {
    console.log("aqui seria a funcao de upload" + e)
  };

  if (!editing) {
    return (
      <div className="space-y-8">
        <div className={`relative h-36 rounded-xl bg-gradient-to-r ${form.banner} ring-1 ring-gray-300 shadow-sm`}>
          {preview && (
            <img
              src={preview}
              alt="logo"
              className="absolute -bottom-7 left-6 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
            />
          )}
          <h2 className="absolute bottom-4 right-6 text-2xl font-semibold text-white drop-shadow-sm">
            {form.nome}
          </h2>
        </div>
        <article className="mx-auto max-w-3xl space-y-4 text-gray-700">
          <p className="text-lg font-medium">{form.descricao_curta}</p>
          <p className="whitespace-pre-line">{form.descricao_longa}</p>
        </article>

        <div className="flex justify-end">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 rounded bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
          >
            <Pencil className="h-4 w-4" /> Editar informações
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-8 rounded-xl bg-gray-50 p-6 ring-1 ring-gray-200"
    >
      <section className="space-y-4">
        <label className="text-sm font-medium">Nome do laboratório</label>
        <input
          className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-primary focus:outline-none"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />

        <label className="text-sm font-medium">Cor do banner</label>
        <Gradients
          value={form.banner}
          onChange={(b) => setForm({ ...form, banner: b })}
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição curta</label>
          <textarea
            rows={3}
            className="w-full resize-none rounded border border-gray-300 p-2 focus:border-primary focus:outline-none"
            value={form.descricao_curta}
            onChange={(e) => setForm({ ...form, descricao_curta: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição longa</label>
          <textarea
            rows={5}
            className="w-full resize-none rounded border border-gray-300 p-2 focus:border-primary focus:outline-none"
            value={form.descricao_longa}
            onChange={(e) =>
              setForm({ ...form, descricao_longa: e.target.value })
            }
          />
        </div>
      </section>

      <section className="space-y-3">
        <label className="text-sm font-medium">Logo</label>
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-full ring-2 ring-gray-300">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                n/a
              </div>
            )}
          </div>

          <label className="inline-flex cursor-pointer items-center gap-1 rounded bg-primary px-3 py-2 text-sm font-medium text-white shadow hover:bg-primary/90">
            <Upload className="h-4 w-4" /> Carregar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="flex items-center gap-1 rounded bg-primary px-5 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
        >
          <Save className="h-4 w-4" /> Salvar
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="flex items-center gap-1 rounded bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          <X className="h-4 w-4" /> Cancelar
        </button>
      </div>
    </form>
  );
}
