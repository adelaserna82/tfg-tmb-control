import { CreateActionPlanRequest, ObjectiveActionPlanDto, ObjectiveAreaDto, ObjectiveMasterDataDto, UpdateActionPlanRequest } from "@/api/generated/model";
import { Action, Area, MasterData, Objective } from './action';


export const areaDtoToArea = (dto: ObjectiveAreaDto): Area => ({
  id: dto.id ?? '',
  name: dto.name ?? '',
  description: dto.description ?? '',

});

export const actionDtoToAction = (dto: ObjectiveActionPlanDto): Action => ({
  id: dto.id!,
  name: dto.name!,
  description: dto.description ?? '',
  order: dto.order!,
  year: dto.year!,
  startIn: dto.startIn!,
  finisIn: dto.finisIn!,
  status: {
    id: dto.status!.id!,
    name: dto.status!.name!,
  },
  area: {
    id: dto.area!.id!,
    name: dto.area!.name!,
    description: dto.description ?? '',
  },
  objective: {
    id: dto.objective!.id!,
    name: dto.objective?.name ?? '',
    description: dto.objective?.description ?? ''
  }
});



export const adaptCommunicationMasterData = (dto: ObjectiveMasterDataDto): MasterData => ({
  areas: dto.areas?.map(c => ({
    id: c.id!,
    name: c.name!,
    description: c.description ?? ''
  })) ?? [],
  objectives: dto.objectives?.map(o => ({
    id: o.id!,
    name: o.name!,
    description: o.description ?? ''
  })) ?? [],
  statuses: dto.statuses?.map(o => ({
    id: o.id!,
    name: o.name!
  })) ?? [],
  years: dto.years?.map(y => y.value).filter((y): y is number => y !== undefined) ?? [],
});

export const actionAreaToCreateReq = (
  area: { name: string, description: string }
): { name: string, description: string } => ({
  name: area.name,
  description: area.description
});

export const objectiveToCreateReq = (
  objective: { name: string, description: string }
): { name: string, description: string } => ({
  name: objective.name,
  description: objective.description
});

export const actionToUpdateReq = (
  action: Action
): UpdateActionPlanRequest => ({
  areaId: action.area.id,
  objectiveId: action.objective.id,
  name: action.name ?? null,
  description: action.description ?? null,
  year: action.year,
  statusId: action.status?.id,
  startIn: action.startIn,
  finisIn: action.finisIn
});

export const actionToCreateReq = (
  action: Action
): CreateActionPlanRequest => ({
  areaId: action.area.id,
  objectiveId: action.objective.id,
  name: action.name ?? null,
  description: action.description ?? null,
  year: action.year,
  statusId: action.status?.id,
  startIn: action.startIn,
  finisIn: action.finisIn
});

