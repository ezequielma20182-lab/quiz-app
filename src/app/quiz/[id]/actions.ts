"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitQuiz(
  quizId: string,
  selectedAnswers: Record<string, string>
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  // Garantizar que el perfil existe (usuarios registrados antes del trigger)
  await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id" });

  // Traer preguntas con la respuesta correcta (solo server-side)
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, answers(id, is_correct)")
    .eq("quiz_id", quizId);

  if (questionsError) throw new Error(`Error al obtener preguntas: ${questionsError.message}`);
  if (!questions || questions.length === 0) throw new Error("Quiz no encontrado");

  const total = questions.length;
  let score = 0;

  for (const question of questions) {
    const correctAnswer = (question.answers as { id: string; is_correct: boolean }[])
      .find((a) => a.is_correct);
    if (correctAnswer && selectedAnswers[question.id] === correctAnswer.id) {
      score++;
    }
  }

  const { error: scoreError } = await supabase.from("user_scores").insert({
    user_id: user.id,
    quiz_id: quizId,
    score,
    total_questions: total,
  });

  if (scoreError) throw new Error(`Error al guardar puntaje: ${scoreError.message}`);

  return { score, total };
}
