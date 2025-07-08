export type Notification = {
    id: string;
    title: string;
    message: string;
    type: "Info" | "Warning" | "Error";
    date: string;
    viewed: boolean;
  };