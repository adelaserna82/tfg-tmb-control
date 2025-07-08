import { Category } from "./category";
import { Frequency } from "./frecuency";
import { Status } from "./status";

export type Indicator = {
    id: string;
    code: string;
    name: string;
    description: string;
    value?: number | null;
    date?: string | null; 
    category: Category;
    status: Status;
    frequency: Frequency;
    min: number;
    max: number;
    unit: string;
    xLocation: number;
    yLocation: number;
    isErrorConfigured: boolean;
    minError: number;
    maxError: number;
    isAlertConfigured: boolean;
    minAlert: number;
    maxAlert: number;
    history: IndicatorHistory[]; 
};

export interface IndicatorHistory {
    value: number;
    statusId: number;
    timestamp: string;
  }
  