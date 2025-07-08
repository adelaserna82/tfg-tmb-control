import type {
  ActualControlDto,
  OperationalControlMasterDataDto,
  CreateActualControlRequest,
  UpdateActualControlRequest,
} from '@/api/generated/model';

import { ActualControl, MasterData } from './operationalControl';


export const dtoToActualControl = (dto: ActualControlDto): ActualControl => ({
  id: dto.id!,
  concept: dto.concept!,
  control: dto.control!,
  observations: dto.observations ?? '',
  lastReview: dto.lastReview ?? null,
  nextReview: dto.nextReview ?? null,
  group: {
    id: dto.group!.id!,
    name: dto.group!.name!,
  },
  frequency: {
    id: dto.frequency!.id!,
    name: dto.frequency!.name!,
  },
  status: {
    id: dto.status!.id!,
    name: dto.status!.name!,
  },
  revisions: dto.revisions?.map(rev => ({
    date: rev.date ?? null,
    nextReview: rev.nextReview ?? null,
    frequency: rev.frequency ? { id: rev.frequency.id!, name: rev.frequency.name! } : undefined,
    status: { id: rev.status!.id!, name: rev.status!.name! },
    observations: rev.observations ?? '',
  })) ?? [],
});

export const actualControlToCreateReq = (control: ActualControl): CreateActualControlRequest => ({
  concept: control.concept,
  control: control.control,
  observations: control.observations ?? '',
  lastReview: control.lastReview ?? null,
  nextReview: control.nextReview ?? null,
  groupId: control.group.id,
  frequencyId: control.frequency.id,
  statusId: control.status.id,
});

export const actualControlToUpdateReq = (control: ActualControl): UpdateActualControlRequest => ({
  concept: control.concept,
  control: control.control,
  observations: control.observations ?? '',
  lastReview: control.lastReview ?? null,
  nextReview: control.nextReview ?? null,
  groupId: control.group.id,
  frequencyId: control.frequency.id,
  statusId: control.status.id,
});

export const adaptOperationalControlMasterData = (dto: OperationalControlMasterDataDto): MasterData => ({
  years: dto.years?.map(y => y.value).filter((y): y is number => y !== undefined) ?? [],
  groups: dto.groups?.map((g) => ({
    id: g.id!,
    name: g.name!,
  })) ?? [],
  frequencies: dto.frequencies?.map((f) => ({
    id: f.id!,
    name: f.name!,
  })) ?? [],
  statuses: dto.statuses?.map((s) => ({
    id: s.id!,
    name: s.name!,
  })) ?? [],
});

export const adaptOperationalControlMasterDataToDto = (data: {
  groups: { id: number; name: string }[];
  frequencies: { id: number; name: string }[];
  statuses: { id: number; name: string }[];
}): OperationalControlMasterDataDto => ({
  groups: data.groups.map((g) => ({ id: g.id, name: g.name })),
  frequencies: data.frequencies.map((f) => ({ id: f.id, name: f.name })),
  statuses: data.statuses.map((s) => ({ id: s.id, name: s.name })),
});

export const operationalControlGroupToCreateReq = (group: { name: string }): { name: string } => ({
  name: group.name,
});

export const operationalControlFrecuencyToCreateReq = (frequency: { name: string }): { name: string } => ({
  name: frequency.name,
});
export const operationalControlFinishedToReq = (observations?: string | null): { observations?: string | null } => ({
  observations: observations,
});
