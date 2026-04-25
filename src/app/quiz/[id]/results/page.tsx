import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function getResult(percentage: number): { emoji: string; message: string; gradient: string } {
  if (percentage === 100) return { emoji: "🏆", message: "¡Perfecto! ¡Lo sabías todo!", gradient: "from-yellow-400 to-orange-400" };
  if (percentage >= 80)  return { emoji: "🥇", message: "¡Muy bien! Casi perfecto.",    gradient: "from-green-400 to-emerald-500" };
  if (percentage >= 60)  return { emoji: "👍", message: "¡Bien! Podés mejorar un poco.", gradient: "from-blue-400 to-indigo-500" };
  if (percentage >= 40)  return { emoji: "😅", message: "Regular. ¡Seguí practicando!", gradient: "from-yellow-400 to-amber-500" };
  return                         { emoji: "📚", message: "¡A estudiar más!",             gradient: "from-red-400 to-rose-500" };
}

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ score?: string; total?: string }>;
}) {
  const { id } = await params;
  const { score: scoreStr, total: totalStr } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const score = parseInt(scoreStr ?? "0");
  const total = parseInt(totalStr ?? "0");
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const result = getResult(percentage);

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("title, category")
    .eq("id", id)
    .single();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${result.gradient} flex flex-col items-center justify-center px-4`}>
      <div className="w-full max-w-sm text-center">

        {/* Emoji resultado */}
        <div className="text-8xl mb-4 drop-shadow-lg">{result.emoji}</div>

        {/* Puntaje */}
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-6 border border-white/30 shadow-2xl">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-1">
            {quiz?.category} · {quiz?.title}
          </p>
          <div className="text-7xl font-black text-white my-4">
            {score}<span className="text-4xl text-white/60">/{total}</span>
          </div>
          <div className="text-2xl font-bold text-white/90">{percentage}%</div>
        </div>

        {/* Mensaje */}
        <p className="text-2xl font-bold text-white mb-8 drop-shadow">
          {result.message}
        </p>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/quiz/${id}`}
            className="px-6 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
          >
            Intentar de nuevo
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-4 bg-white/20 text-white border border-white/30 rounded-2xl font-bold text-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            Ver más quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}
