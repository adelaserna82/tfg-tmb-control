import { Action } from "./action";


export type GroupedArea = {
    areaId: string;
    areaName: string;
    objectives: {
      objectiveId: string;
      objectiveName: string;
      actions: Action[];
    }[];
  };
  