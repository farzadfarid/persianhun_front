import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { notificationsOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { NotificationListItemDto } from '../../features/notifications/models/notification.model';
import { NotificationsApiService } from '../../features/notifications/services/notifications-api.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [IonContent, IonIcon, NgIf, NgFor, DatePipe, TranslateModule, AppHeaderComponent, AppButtonComponent],
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly notificationsApi = inject(NotificationsApiService);

  notifications: NotificationListItemDto[] = [];
  isLoading = true;
  hasError = false;
  isMarkingAll = false;

  constructor() {
    addIcons({ notificationsOutline, checkmarkDoneOutline });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const user = this.auth.currentUser;
    if (!user) { this.isLoading = false; return; }

    this.notificationsApi.getUserNotifications(user.userId).subscribe({
      next: (items) => { this.notifications = items; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  markAsRead(notification: NotificationListItemDto): void {
    if (notification.isRead) return;
    this.notificationsApi.markAsRead(notification.id).subscribe({
      next: () => { notification.isRead = true; },
      error: () => {},
    });
  }

  markAllAsRead(): void {
    const user = this.auth.currentUser;
    if (!user || this.isMarkingAll) return;

    this.isMarkingAll = true;
    this.notificationsApi.markAllAsRead(user.userId).subscribe({
      next: () => {
        this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
        this.isMarkingAll = false;
      },
      error: () => { this.isMarkingAll = false; },
    });
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  readonly skeletons = [1, 2, 3, 4, 5];
}
