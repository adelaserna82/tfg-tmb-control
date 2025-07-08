import { UserNotificationDto } from "@/api/generated/model";
import { Notification } from "@/modules/notifications/types/notification";

export const dtoToNotification = (dto: UserNotificationDto): Notification => ({
  id: dto.id ?? "",
  title: dto.title ?? "",
  message: dto.message ?? "",
  type: (dto.type as "info" | "warning" | "error") ?? "info",
  date: dto.createdAt ?? "",
  viewed: dto.isRead ?? false,
});