import type {
  CommunicationDto,
  CommunicationMasterDataDto,
  CreateCommunicationRequest,
  UpdateCommunicationRequest,
} from '@/api/generated/model';
import { Communication, MasterData } from './communication';


export const dtoToCommunication = (dto: CommunicationDto): Communication => ({
  id: dto.id!,
  category: {
    id: dto.category!.id!,
    name: dto.category!.name!,
  },
  origin: {
    id: dto.origin!.id!,
    name: dto.origin!.name!,
  },
  format: dto.format
    ? {
      id: dto.format.id!,
      name: dto.format.name!,
    }
    : null,
  responsibles: dto.responsibles?.map((r) => ({
    id: r.id!,
    name: r.name!,
    email: r.email!,
  })) ?? [],
  date: dto.date ?? new Date().toISOString(),
  dueDate: dto.dueDate,
  description: dto.description ?? '',
  relatedId: dto.relatedId ?? null,
  related: dto.related ? {
    id: dto.related.id!,
    origin: {
      id: dto.related.origin!.id!,
      name: dto.related.origin!.name!,
    },
    date: dto.related.date!,
    description: dto.related.description!,
  } : null,
  status: {
    id: dto.status!.id!,
    name: dto.status!.name!,
  },
  filePath: dto.filePath ?? '',
});

export const communicationToCreateReq = (
  comm: Communication
): CreateCommunicationRequest => ({
  categoryId: comm.category.id,
  originId: comm.origin.id,
  formatId: comm.format ? comm.format.id : null,
  date: comm.date,
  dueDate: comm.dueDate === '' ? null : comm.dueDate,
  description: comm.description,
  relatedId: comm.relatedId,
  statusId: comm.status.id,
  filePath: comm.filePath,
  responsibleIds: comm.responsibles.map((r) => r.id),
});

export const communicationToUpdateReq = (
  comm: Communication
): UpdateCommunicationRequest => ({
  categoryId: comm.category.id,
  originId: comm.origin.id,
  formatId: comm.format ? comm.format.id : null,
  date: comm.date,
  dueDate: comm.dueDate === '' ? null : comm.dueDate,
  description: comm.description,
  relatedId: comm.relatedId,
  statusId: comm.status.id,
  filePath: comm.filePath,
  responsibleIds: comm.responsibles.map((r) => r.id),
});

export const dtoListToCommunications = (
  dtos: CommunicationDto[]
): Communication[] => dtos.map(dtoToCommunication);

export const adaptCommunicationMasterData = (dto: CommunicationMasterDataDto): MasterData => ({
  categories: dto.categories?.map(c => ({
    id: c.id!,
    name: c.name!,
  })) ?? [],
  origins: dto.origins?.map(o => ({
    id: o.id!,
    name: o.name!,
  })) ?? [],
  formats: dto.formats?.map(f => ({
    id: f.id!,
    name: f.name!,
  })) ?? [],
  responsibles: dto.responsibles?.map(r => ({
    id: r.id!,
    name: r.name!,
    email: r.email!,
  })) ?? [],
  statuses: dto.statuses?.map(s => ({
    id: s.id!,
    name: s.name!,
  })) ?? [],
  years: dto.years?.map(y => y.value).filter((y): y is number => y !== undefined) ?? [],
});

export const communicationFormatToCreateReq = (
  format: { name: string }
): { name: string } => ({
  name: format.name,
});

export const communicationOriginToCreateReq = (
  origin: { name: string }
): { name: string } => ({
  name: origin.name,
});
