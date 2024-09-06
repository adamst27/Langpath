declare interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

declare interface Plan {
  _id: string;
  language: string;
  flag: string;
  isDone: boolean;
  steps: {
    title: string;
    substeps: {
      title: string;
      details: string[];
      isDone: boolean;
    }[];
    importantNote?: string;
    isDone: boolean;
  }[];
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
}
