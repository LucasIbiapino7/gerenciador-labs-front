function Feature({ icon, title, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow ring-1 ring-gray-100 transition hover:shadow-md">
      <div className="text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-center text-sm text-gray-600">{children}</p>
    </div>
  );
}

export default Feature;