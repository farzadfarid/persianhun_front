export interface NotificationListItemDto {
  id: number;
  type: string;
  title: string;
  isRead: boolean;
  createdAtUtc: string;
}

export interface NotificationDto {
  id: number;
  appUserId: number;
  type: string;
  title: string;
  message: string;
  referenceType: string | null;
  referenceId: number | null;
  isRead: boolean;
  readAtUtc: string | null;
  createdAtUtc: string;
}
