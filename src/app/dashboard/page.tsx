import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

const categoryConfig: Record<string, { emoji: string; gradient: string; button: string }> = {
  Fútbol:        { emoji: "⚽", gradient: "from-green-400 to-emerald-600",   button: "bg-green-600 hover:bg-green-700" },
  Básquet:       { emoji: "🏀", gradient: "from-orange-400 to-amber-600",    button: "bg-orange-600 hover:bg-orange-700" },
  Automovilismo: { emoji: "🏎️", gradient: "from-red-400 to-rose-600",        button: "bg-red-600 hover:bg-red-700" },
  Vóley:         { emoji: "🏐", gradient: "from-blue-400 to-indigo-600",     button: "bg-blue-600 hover:bg-blue-700" },
  Tenis:         { emoji: "🎾", gradient: "from-yellow-300 to-lime-500",     button: "bg-lime-600 hover:bg-lime-700" },
};

const fallback = { emoji: "🏅", gradient: "from-gray-400 to-gray-600", button: "bg-gray-600 hover:bg-gray-700" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, title, description, category")
    .eq("is_published", true)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-4 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Quiz{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Argentina
              </span>
            </h1>
            <p className="text-indigo-300 text-xs mt-0.5">{user.email}</p>
          </div>
          <form>
            <button
              formAction={logout}
              className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors font-medium"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">¿A qué jugamos hoy?</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Elegí una categoría y ponete a prueba</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes?.map((quiz) => {
            const config = categoryConfig[quiz.category] ?? fallback;
            return (
              <div
                key={quiz.id}
                className="flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-900"
              >
                {/* Cabecera colorida */}
                <div className={`bg-gradient-to-br ${config.gradient} p-6 flex items-center gap-4`}>
                  <span className="text-5xl drop-shadow">{config.emoji}</span>
                  <span className="text-white font-bold text-lg leading-tight">{quiz.category}</span>
                </div>

                {/* Cuerpo */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white leading-tight">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 leading-relaxed">
                    {quiz.description}
                  </p>
                  <Link
                    href={`/quiz/${quiz.id}`}
                    className={`mt-2 w-full text-center py-3 text-white rounded-xl font-bold transition-colors text-sm ${config.button}`}
                  >
                    Jugar →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
