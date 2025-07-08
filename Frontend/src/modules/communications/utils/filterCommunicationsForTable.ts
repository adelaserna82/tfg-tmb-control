import { Communication } from "../types/communication";
import { Filters } from "../types/filters";

function matchesSearch(obj: any, searchText: string, key?: string): boolean {
  if (!obj) return false;

  if (key === "id" && typeof obj === "number") {
    const formattedId = `#${obj.toString().padStart(5, "0")}#`;
    return formattedId.includes(searchText);
  }

  if (typeof obj === "string") return obj.toLowerCase().includes(searchText.toLowerCase());
  if (typeof obj === "number") return obj.toString().includes(searchText);

  if (typeof obj === "object") {
    return Object.entries(obj).some(([k, value]) => matchesSearch(value, searchText, k));
  }

  return false;
}

export function filterCommunicationsForTable(all: Communication[], filters: Filters): Communication[] {
  return all.filter(comm => {
    const matchesCategory = !filters.category || comm.category?.id === filters.category;
    const matchesYear = !filters.year || new Date(comm.date!).getFullYear() === filters.year;
    const matchesOrigin = !filters.origin || comm.origin?.id === filters.origin;
    const matchesFormat = !filters.format || comm.format?.id === filters.format;
    const matchesStatus = filters.status.length === 0 || filters.status.includes(comm.status?.id!);
    const matchesResponsibles = filters.responsibles.length === 0 ||
      comm.responsibles?.some(r => filters.responsibles.includes(r.id));

    const matchesText = !filters.searchText || Object.entries(comm).some(([key, value]) =>
      matchesSearch(value, filters.searchText!, key)
    );

    return (
      matchesCategory &&
      matchesYear &&
      matchesOrigin &&
      matchesFormat &&
      matchesStatus &&
      matchesResponsibles &&
      matchesText
    );
  });
}
