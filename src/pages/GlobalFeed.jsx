import { useEffect, useState } from "react";
import FeedItemCard from "../components/Feed/FeedItemCard";
import { buscarFeedGlobal } from "../services/FeedService";

export default function GlobalFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    buscarFeedGlobal()
      .then(setItems)
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar o feed.");
      })
      .finally(() => setLoad(false));
  }, []);

  if (loading) return <p>Carregando feed…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-xl font-semibold">Últimas atualizações</h2>

      {items.map((item) => (
        <FeedItemCard key={`${item.tipo}-${item.id}`} item={item} />
      ))}
    </section>
  );
}
