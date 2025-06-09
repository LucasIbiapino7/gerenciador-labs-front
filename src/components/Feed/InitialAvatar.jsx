const bgMap = {
  cyan: 'bg-cyan-400',
  green: 'bg-emerald-400',
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
  gray: 'bg-gray-400',
};

export default function InitialAvatar({ name, color = 'gray' }) {
  const initial = name?.charAt(0).toUpperCase() || '?';
  const bgClass = bgMap[color] || bgMap.gray;

  return (
    <span
      className={`${bgClass} flex h-10 w-10 items-center justify-center rounded-full text-white font-medium`}
    >
      {initial}
    </span>
  );
}
