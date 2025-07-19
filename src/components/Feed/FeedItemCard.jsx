import PostCard from './PostCard';
import EventCard from './EventCard';

export default function FeedItemCard({ item }) {
  const accent = item.lab?.accentColor || 'cyan';

  return (
    <div style={{ '--accent': `var(--tw-${accent}-500)` }}>
      {item.tipo === 'EVENTO' ? (
        <EventCard item={item} />
      ) : (
        <PostCard item={item} />
      )}
    </div>
  );
}
