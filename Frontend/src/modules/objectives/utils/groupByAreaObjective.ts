import { Action } from "../types/action";
import { GroupedArea } from "../types/groupedArea";


export function groupByAreaObjective(actions: Action[]): GroupedArea[] {

    const areaMap = new Map<
      string,
      {
        areaName: string;
        objectives: Map<string, { objectiveName: string; actions: Action[] }>;
      }
    >();
  
    for (const act of actions) {

      let areaEntry = areaMap.get(act.area.id);
      if (!areaEntry) {
        areaEntry = {
          areaName: act.area.name,
          objectives: new Map(),
        };
        areaMap.set(act.area.id, areaEntry);
      }
  

      let objEntry = areaEntry.objectives.get(act.objective.id);
      if (!objEntry) {
        objEntry = {
          objectiveName: act.objective.name,
          actions: [],
        };
        areaEntry.objectives.set(act.objective.id, objEntry);
      }
  

      objEntry.actions.push(act);
    }
  

    const result: GroupedArea[] = [];
    for (const [areaId, areaEntry] of areaMap.entries()) {
      const objectiveArray = [];
      for (const [objId, objEntry] of areaEntry.objectives.entries()) {
        objectiveArray.push({
          objectiveId: objId,
          objectiveName: objEntry.objectiveName,
          actions: objEntry.actions,
        });
      }
      result.push({
        areaId,
        areaName: areaEntry.areaName,
        objectives: objectiveArray,
      });
    }
  
    return result;
  }