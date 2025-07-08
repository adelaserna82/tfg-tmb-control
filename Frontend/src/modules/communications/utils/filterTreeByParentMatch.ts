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

export function filterTreeByParentMatch(all: Communication[], filters: Filters): Communication[] {
  const groupedByParent = new Map<string, Communication[]>();
  for (const comm of all) {
    if (comm.relatedId) {
      if (!groupedByParent.has(comm.relatedId)) {
        groupedByParent.set(comm.relatedId, []);
      }
      groupedByParent.get(comm.relatedId)!.push(comm);
    }
  }

  const matchesFilters = (comm: Communication): boolean => {
    if (filters.category && comm.category?.id !== filters.category) return false;
    if (filters.year && new Date(comm.date!).getFullYear() !== filters.year) return false;
    if (filters.origin && comm.origin?.id !== filters.origin) return false;
    if (filters.format && comm.format?.id !== filters.format) return false;
    if (filters.status.length > 0 && !filters.status.includes(comm.status?.id!)) return false;
    if (filters.responsibles.length > 0 && !comm.responsibles?.some(r => filters.responsibles.includes(r.id))) return false;
    return true;
  };

  const result = new Map<string, Communication>();

  for (const parent of all.filter(c => !c.relatedId)) {
    const matches = matchesFilters(parent);
    const matchesText = filters.searchText
      ? Object.entries(parent).some(([key, value]) => matchesSearch(value, filters.searchText!, key))
      : true;

    if (matches && matchesText) {
      result.set(parent.id!, parent);

      const children = groupedByParent.get(parent.id!) ?? [];
      for (const child of children) {
        result.set(child.id!, child);
      }
    }
  }

  return Array.from(result.values());
}
