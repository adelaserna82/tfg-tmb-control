export type Status = {
    id: number;
    name: string;
};

export type Category = {
    id: number;
    name: string;
};

export type Origin = {
    id: number;
    name: string;
};

export type Format = {
    id: number;
    name: string;
};

export type Responsible = {
    id: string;
    name: string;
    email: string;
};

export type Related = {
    id: string;
    origin: Origin;
    date: string;
    description: string;
};

export type Communication = {
  id: string;
  category: Category;
  origin: Origin;
  format?: Format | null;
  responsibles: Responsible[];
  date: string;
  dueDate?: string | null;
  description: string;
  relatedId: string | null;
  related: Related | null;
  status: Status;
  filePath?: string;
}

export type MasterData = {
  categories: Category[];
  origins: Origin[];
  formats: Format[];
  responsibles: Responsible[];
  statuses: Status[];
  years: number[];
};



