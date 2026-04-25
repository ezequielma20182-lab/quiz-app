"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitQuiz } from "./actions";
import type { Question, Quiz } from "@/lib/types";

export default function QuizClient({
  quiz,
  questions,
}: {
  quiz: Quiz;
  questions: Question[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const hasSelected = !!selected[current.id];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  function handleSelect(answerId: string) {
    if (isPending) return;
    setSelected((prev) => ({ ...prev, [current.id]: answerId }));
  }

  function handleNext() {
    if (!hasSelected || isPending) return;

    if (isLast) {
      setError(null);
      startTransition(async () => {
        try {
          const result = await submitQuiz(quiz.id, selected);
          router.push(`/quiz/${quiz.id}/results?score=${result.score}&total=${result.total}`);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Ocurrió un error inesperado");
        }
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header con gradiente */}
      <header className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-4 pt-6 pb-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-indigo-300 font-medium text-sm">{quiz.category}</span>
            <span className="text-indigo-300 font-medium text-sm">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <h1 className="text-xl font-bold mb-4">{quiz.title}</h1>
          {/* Barra de progreso */}
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Tarjeta de pregunta (superpuesta al header) */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 -mt-6 pb-8 flex flex-col">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 mb-6">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">
            Pregunta {currentIndex + 1}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
            {current.text}
          </h2>
        </div>

        {/* Opciones */}
        <div className="flex flex-col gap-3 flex-1">
          {current.answers.map((answer, i) => {
            const isSelected = selected[current.id] === answer.id;
            return (
              <button
                key={answer.id}
                onClick={() => handleSelect(answer.id)}
                disabled={isPending}
                className={`w-full text-left px-4 py-4 rounded-2xl border-2 font-medium transition-all flex items-center gap-4 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-md shadow-indigo-200 dark:shadow-none"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-400 hover:shadow-sm text-gray-800 dark:text-gray-200"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {letters[i]}
                </span>
                <span className="text-base">{answer.text}</span>
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Botón */}
        <button
          onClick={handleNext}
          disabled={!hasSelected || isPending}
          className="mt-6 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-300/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isPending ? "Calculando..." : isLast ? "Finalizar 🏁" : "Siguiente →"}
        </button>
      </main>
    </div>
  );
}
