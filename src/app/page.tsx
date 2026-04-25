import Link from "next/link";

const sports = [
  { emoji: "⚽", label: "Fútbol" },
  { emoji: "🏀", label: "Básquet" },
  { emoji: "🏎️", label: "Automovilismo" },
  { emoji: "🏐", label: "Vóley" },
  { emoji: "🎾", label: "Tenis" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Emojis flotantes */}
      <div className="flex gap-6 mb-8 text-4xl">
        {sports.map((s) => (
          <span key={s.label} title={s.label} className="drop-shadow-lg">
            {s.emoji}
          </span>
        ))}
      </div>

      {/* Título */}
      <h1 className="text-5xl sm:text-7xl font-black mb-4 text-white leading-tight tracking-tight">
        Quiz{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
          Argentina
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-indigo-200 mb-10 max-w-md">
        Ponete a prueba sobre fútbol, básquet, tenis y mucho más.
      </p>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:w-auto">
        <Link
          href="/register"
          className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-2xl font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all shadow-lg shadow-orange-500/30"
        >
          Crear cuenta
        </Link>
        <Link
          href="/login"
          className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm"
        >
          Iniciar sesión
        </Link>
      </div>

      {/* Categorías */}
      <div className="mt-14 flex flex-wrap justify-center gap-3">
        {sports.map((s) => (
          <span
            key={s.label}
            className="px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10"
          >
            {s.emoji} {s.label}
          </span>
        ))}
      </div>
    </main>
  );
}
