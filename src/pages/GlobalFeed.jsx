import { useEffect, useState } from 'react';
import FeedItemCard from '../components/Feed/FeedItemCard';

async function loadFeed() {
  const module = await import('../mocks/feed.json');
  return module.default;
}

export default function GlobalFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Carregando feed…</p>;

  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-xl font-semibold">Últimas atualizações</h2>

      {items.map((item) => (
        <FeedItemCard key={`${item.type}-${item.id}`} item={item} />
      ))}
    </section>
  );
}
