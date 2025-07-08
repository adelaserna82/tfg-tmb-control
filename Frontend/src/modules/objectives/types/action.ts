
export type Action = {
    id: string;
    year: number;
    area: Area;
    objective: Objective;
    name: string;
    description: string;
    order: number;
    status: Status;
    startIn: string;
    finisIn: string;
};

export type Objective = {
    id: string;
    name: string;
    description: string;

};

export type Status = {
    id: number;
    name: string;
};

export type Area = {
    id: string;
    name: string;
    description: string;
}

export type MasterData = {
    years: number[];
    areas: Area[];
    objectives: Objective[];
    statuses: Status[];
};