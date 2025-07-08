import { Action, Area, Objective } from "../types/action";
import { Filters } from "../types/fiters";

export function matchText(name: string, description: string | null | undefined, search: string) {
    const combined = (name + " " + (description ?? "")).toLowerCase();
    return combined.includes(search.toLowerCase());
}

export function buildFilteredSets(
    allAreas: Area[],
    allObjectives: Objective[],
    allActions: Action[],
    filters: Filters
) {
    const { year, searchText, area, objective } = filters;
    const search = searchText.toLowerCase().trim();

    let validActions = allActions.filter(act => act.year === year);

    if (area) {
        validActions = validActions.filter(act => act.area.id === area);
    }

    if (objective) {
        validActions = validActions.filter(act => act.objective.id === objective);
    }

    const areaIds = new Set<string>();
    const objectiveIds = new Set<string>();
    const actionIds = new Set<string>();

    if (!search) {
        validActions.forEach(act => {
            areaIds.add(act.area.id);
            objectiveIds.add(act.objective.id);
            actionIds.add(act.id);
        });
        return { areaIds, objectiveIds, actionIds };
    }

    validActions.forEach(act => {
        const matches = matchText(act.name, act.description, search);
        if (matches) {
            areaIds.add(act.area.id);
            objectiveIds.add(act.objective.id);
            actionIds.add(act.id);
        }
    });

    allObjectives.forEach(obj => {
        if (matchText(obj.name, obj.description, search)) {
            objectiveIds.add(obj.id);
        }
    });

    allAreas.forEach(area => {
        if (matchText(area.name, area.description, search)) {
            areaIds.add(area.id);
        }
    });

    return { areaIds, objectiveIds, actionIds };
}

export function filterData(
    allAreas: Area[],
    allObjectives: Objective[],
    allActions: Action[],
    filters: Filters
) {
    const { actionIds } = buildFilteredSets(
        allAreas,
        allObjectives,
        allActions,
        filters
    );

    const finalActions = allActions.filter(act => actionIds.has(act.id));
    return { finalActions };
}
