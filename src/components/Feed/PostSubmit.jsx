import { useState } from "react";

export default function PostSubmit({ onSubmit }) {
  const [text, setText] = useState("");

  const handlePost = () => {
    if (!text.trim()) return;
    (onSubmit || console.log)("Novo post:", text.trim());
    setText("");
  };

  return (
    <div className="rounded-xl border-2 border-primary/60 bg-white p-4 shadow space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Compartilhe uma novidade com o lab..."
        className="w-full resize-none rounded border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none"
        rows={3}
      />
      <div className="flex justify-end">
        <button
          onClick={handlePost}
          disabled={!text.trim()}
          className="rounded bg-primary px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
        >
          Postar
        </button>
      </div>
    </div>
  );
}
