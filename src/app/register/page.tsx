import Link from "next/link";
import { register } from "./actions";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / título */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-black text-white">
            Quiz{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Argentina
            </span>
          </h1>
          <p className="text-indigo-300 mt-1 text-sm">Creá tu cuenta y empezá a jugar</p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white/80 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
              />
            </div>
            <button
              formAction={register}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all shadow-lg shadow-orange-500/30 mt-1"
            >
              Crear cuenta
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6 text-indigo-300">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-white font-semibold hover:text-yellow-400 transition-colors">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
