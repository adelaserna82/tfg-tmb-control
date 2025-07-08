import type {
  IndicatorDto,
  CreateIndicatorRequest,
  UpdateIndicatorRequest,
  IndicatorsMasterDataDto,
} from '@/api/generated/model';
import type { Indicator } from '../types/indicator';
import { MasterData } from './masterData';


export const dtoToIndicator = (dto: IndicatorDto): Indicator => ({
  id: dto.id,
  code: dto.code ?? '',
  name: dto.name ?? '',
  description: dto.description ?? '',
  value: dto.value ?? 0,
  unit: dto.unit ?? '',
  date: dto.date ?? new Date().toISOString(),
  category: {
    id: dto.category.id,
    name: dto.category.name ?? '',
    description: dto.category.description ?? '',
    order: dto.category.order ?? 0,

  },
  frequency: {
    id: dto.frequency.id,
    name: dto.frequency.name ?? ''
  },

  status: {
    id: dto.status.id,
    name: dto.status.name ?? '',
  },

  min: dto.min ?? 0,
  max: dto.max ?? 100,
  xLocation: dto.xLocation ?? 50,
  yLocation: dto.yLocation ?? 50,
  isErrorConfigured: dto.isErrorConfigured ?? false,
  minError: dto.minError ?? 0,
  maxError: dto.maxError ?? 0,
  isAlertConfigured: dto.isAlertConfigured ?? false,
  minAlert: dto.minAlert ?? 0,
  maxAlert: dto.maxAlert ?? 0,
  history: dto.history!.map((h) => ({
    value: h.value!,
    statusId: h.statusId!,
    timestamp: h.timestamp!,
  })),
});

export const indicatorToCreateReq = (
  ind: Indicator
): CreateIndicatorRequest => ({
  code: ind.code,
  name: ind.name,
  description: ind.description,
  unit: ind.unit,
  categoryId: ind.category.id,
  frequencyId: ind.frequency.id,
  min: ind.min,
  max: ind.max,
  xLocation: ind.xLocation,
  yLocation: ind.yLocation,
  isErrorConfigured: ind.isErrorConfigured,
  minError: ind.minError,
  maxError: ind.maxError,
  isAlertConfigured: ind.isAlertConfigured,
  minAlert: ind.minAlert,
  maxAlert: ind.maxAlert,

});

export const indicatorToUpdateReq = (
  ind: Indicator
): UpdateIndicatorRequest => ({
  code: ind.code,
  name: ind.name,
  description: ind.description,
  unit: ind.unit,
  categoryId: ind.category.id,
  frequencyId: ind.frequency.id,
  min: ind.min,
  max: ind.max,
  xLocation: ind.xLocation,
  yLocation: ind.yLocation,
  isErrorConfigured: ind.isErrorConfigured,
  minError: ind.minError,
  maxError: ind.maxError,
  isAlertConfigured: ind.isAlertConfigured,
  minAlert: ind.minAlert,
  maxAlert: ind.maxAlert,
});

export const adaptIndicatorsMasterData = (dto: IndicatorsMasterDataDto): MasterData => ({
  frequencies: dto.frequencies?.map((f) => ({
    id: f.id!,
    name: f.name!,
  })) ?? [],
  categories: dto.categories?.map((s) => ({
    id: s.id!,
    name: s.name!,
    description: s.description ?? '',
    order: s.order ?? 0,
  })) ?? [],
});



export const indicatorCategoryToCreateReq = (category: { name: string }): { name: string } => ({
  name: category.name,
});