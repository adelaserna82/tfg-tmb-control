import { ActualControl, Revision } from "../types/operationalControl";

export const parseDate = (date: string | Date): number => {
    if (typeof date === "string") {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day).getTime();
    }
    return new Date(date).getTime();
};

export const sortByDateAscending = (operations: ActualControl[]): ActualControl[] => {
    return operations.sort((a, b) => {
        const dateA = a.lastReview ? parseDate(a.lastReview) : Infinity;
        const dateB = b.lastReview ? parseDate(b.lastReview) : Infinity;
        return dateA - dateB;
    });
};

export const sortRevisionsByDateAscending = (operations: Revision[]): Revision[] => {
    return operations.sort((a, b) => {
        const dateA = a.date ? parseDate(a.date) : Infinity;
        const dateB = b.date ? parseDate(b.date) : Infinity;
        return dateA - dateB;
    });
};
