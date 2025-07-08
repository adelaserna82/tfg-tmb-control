export interface Group {
    id: number;
    name: string;
}

export interface Frequency {
    id: number;
    name: string;
}

export interface Status {
    id: number;
    name: string;
}
    
export interface Revision {
    date?: string | null; 
    nextReview?: string | null; 
    frequency?: Frequency;
    status: Status;
    observations?: string | null;
}

export interface RevisionRow {
    date?: string | null;
    nextReview?: string | null;
    situationName: string;
    frequencyName?: string;
    observations?: string | null;
}

export interface ActualControl {
    id: string;
    group: Group;
    concept: string;
    control: string;
    lastReview?: string | null;
    frequency: Frequency;
    nextReview?: string | null;
    status: Status;
    observations?: string | null;
    revisions?: Revision[];
}

export type MasterData = {
  groups: Group[];
  frequencies: Frequency[];
  statuses: Status[];
  years: number[];
};
