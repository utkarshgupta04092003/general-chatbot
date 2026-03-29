export type DataSource = {
  id: string;
  url: string;
  title: string;
  wordCount: number;
  status: string;
  createdAt: string;
  chatbotId: string;
  chatbot: {
    name: string;
  };
};
