import { Filters } from "../types/filters";
import { ActualControl } from "../types/operationalControl";

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

export function filterOperationalControlForTable(all: ActualControl[], filters: Filters): ActualControl[] {
  return all.filter((item) => {
    const matchesGroup = !filters.group || item.group.id === filters.group;
    const matchesFrequency = !filters.frequency || item.frequency.id === filters.frequency;
    const matchesStatus = filters.status.length === 0 || filters.status.includes(item.status.id);
    const matchesYear = !filters.year || (
      item.nextReview && new Date(item.nextReview).getFullYear() === filters.year
    );

    const matchesText = !filters.searchText || Object.entries(item).some(
      ([key, value]) => matchesSearch(value, filters.searchText!, key)
    );

    return (
      matchesGroup &&
      matchesFrequency &&
      matchesStatus &&
      matchesYear &&
      matchesText
    );
  });
}
