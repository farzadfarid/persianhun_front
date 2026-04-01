import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { NotificationDto, NotificationListItemDto } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private readonly api = inject(ApiService);

  getUserNotifications(userId: number): Observable<NotificationListItemDto[]> {
    return this.api.get<NotificationListItemDto[]>(`/notifications/user/${userId}`);
  }

  getUnreadNotifications(userId: number): Observable<NotificationListItemDto[]> {
    return this.api.get<NotificationListItemDto[]>(`/notifications/user/${userId}/unread`);
  }

  markAsRead(notificationId: number): Observable<NotificationDto> {
    return this.api.patch<NotificationDto>(`/notifications/${notificationId}/read`, {});
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.api.patch<void>(`/notifications/user/${userId}/read-all`, {});
  }
}
