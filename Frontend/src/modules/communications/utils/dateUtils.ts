import { Communication } from "../types/communication";

export const parseDate = (date: string | Date): number => {
    if (typeof date === "string") {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day).getTime();
    }
    return new Date(date).getTime();
};

export const sortByDateAscending = (communications: Communication[]): Communication[] => {
    return communications.sort((a, b) => parseDate(a.date) - parseDate(b.date));
};
