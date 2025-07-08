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

export function filterCommunications(all: Communication[], filters: Filters): Communication[] {
  const byId = new Map(all.map((c) => [c.id!, c]));
  const groupedByParent = new Map<string | null, Communication[]>();

  for (const comm of all) {
    const key = comm.relatedId ?? null;
    if (!groupedByParent.has(key)) {
      groupedByParent.set(key, []);
    }
    groupedByParent.get(key)!.push(comm);
  }

  const matchesFilters = (comm: Communication): boolean => {
    if (filters.category && comm.category?.id !== filters.category) return false;
    if (filters.year && new Date(comm.date!).getFullYear() !== filters.year) return false;
    if (filters.origin && comm.origin?.id !== filters.origin) return false;
    if (filters.format && comm.format?.id !== filters.format) return false;
    if (filters.status.length > 0 && !filters.status.includes(comm.status?.id!)) return false;
    if (filters.responsibles.length > 0 && !comm.responsibles?.some((r) => filters.responsibles.includes(r.id)))
      return false;
    return true;
  };

  const visited = new Set<string>();
  const result = new Map<string, Communication>();

  const includeDescendants = (comm: Communication) => {
    if (visited.has(comm.id!)) return;
    visited.add(comm.id!);
    result.set(comm.id!, comm);

    const children = groupedByParent.get(comm.id!) ?? [];
    for (const child of children) {
      includeDescendants(child);
    }
  };

  for (const comm of all) {
    const matches = matchesFilters(comm);
    const matchesText = filters.searchText
      ? Object.entries(comm).some(([key, value]) => matchesSearch(value, filters.searchText!, key))
      : true;

    if (matches && matchesText) {
      includeDescendants(comm);

      // Añadir padres
      let current = comm;
      while (current.relatedId) {
        const parent = byId.get(current.relatedId);
        if (!parent) break;
        result.set(parent.id!, parent);
        current = parent;
      }
    }
  }

  return Array.from(result.values());
}
