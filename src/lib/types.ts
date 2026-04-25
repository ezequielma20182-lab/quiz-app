export type Answer = { id: string; text: string };

export type Question = {
  id: string;
  text: string;
  order_index: number;
  answers: Answer[];
};

export type Quiz = {
  id: string;
  title: string;
  category: string;
};
