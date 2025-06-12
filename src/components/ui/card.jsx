export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl shadow-md bg-[#faf5ff] border border-[#a855f7]/30 p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`space-y-2 text-gray-800 ${className}`}>
      {children}
    </div>
  );
}
