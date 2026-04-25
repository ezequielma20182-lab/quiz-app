import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuizClient from "./quiz-client";
import type { Question, Quiz } from "@/lib/types";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, title, category")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!quiz) notFound();

  const { data: questions } = await supabase
    .from("questions")
    .select("id, text, order_index, answers(id, text)")
    .eq("quiz_id", id)
    .order("order_index");

  if (!questions || questions.length === 0) notFound();

  return <QuizClient quiz={quiz as Quiz} questions={questions as Question[]} />;
}
