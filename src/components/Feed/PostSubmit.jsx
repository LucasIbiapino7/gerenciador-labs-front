import { useState } from "react";
import { criarPost } from "../../services/PostService";

export default function PostSubmit({ labId, isPrivate = false, onCreated }) {
  const [text, setText] = useState("");
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);

  async function handlePost() {
    if (!text.trim() || loading) return;
    setLoad(true);
    setError(null);

    try {
      const novo = await criarPost(labId, text.trim(), isPrivate);
      onCreated?.(novo);
      setText("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        setError("Conteúdo é obrigatório.");
      } else if (err.response?.status === 403) {
        setError("Você não tem permissão para postar.");
      } else {
        setError("Falha ao criar o post.");
      }
    } finally {
      setLoad(false);
    }
  }
  return (
    <div className="space-y-3 rounded-xl border-2 border-primary/60 bg-white p-4 shadow">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Compartilhe uma novidade com o lab..."
        className="w-full resize-none rounded border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none"
        rows={3}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end">
        <button
          onClick={handlePost}
          disabled={!text.trim() || loading}
          className="rounded bg-primary px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {loading ? "Postando…" : "Postar"}
        </button>
      </div>
    </div>
  );
}
