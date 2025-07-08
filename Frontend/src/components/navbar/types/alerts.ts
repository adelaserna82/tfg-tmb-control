export type Alert = {
    id: number;
    title: string;
    message: string;
    type: "info" | "warning" | "error";
    date: string;
    viewed: boolean;
  };