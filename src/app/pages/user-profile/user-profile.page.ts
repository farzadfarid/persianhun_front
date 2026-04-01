import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  businessOutline, cardOutline, chevronForwardOutline,
  heartOutline, logOutOutline, notificationsOutline,
  personCircleOutline, settingsOutline, starOutline, bulbOutline,
  cameraOutline,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { FileUploadService } from '../../core/services/file-upload.service';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [IonContent, IonIcon, RouterLink, AppHeaderComponent, AppButtonComponent],
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  readonly auth = inject(AuthService);
  readonly fileUpload = inject(FileUploadService);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  profileImageUrl: string | null = null;
  uploadingPhoto = false;

  constructor() {
    addIcons({
      businessOutline, cardOutline, settingsOutline, chevronForwardOutline,
      logOutOutline, heartOutline, notificationsOutline,
      personCircleOutline, starOutline, bulbOutline, cameraOutline,
    });
  }

  ngOnInit(): void {
    if (this.auth.currentUser) {
      this.api.get<{ profileImageUrl: string | null }>('/users/me').subscribe({
        next: (profile) => { this.profileImageUrl = profile.profileImageUrl; },
      });
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingPhoto = true;
    this.fileUpload.uploadImage(file).subscribe({
      next: (url) => {
        this.api.patch<void>('/users/me/profile-image', { profileImageUrl: url }).subscribe({
          next: () => {
            this.profileImageUrl = url;
            this.uploadingPhoto = false;
            this.toast.success('Profile photo updated!');
          },
          error: () => { this.uploadingPhoto = false; },
        });
      },
      error: () => { this.uploadingPhoto = false; },
    });
    input.value = '';
  }

  logout(): void {
    this.auth.logout();
  }
}
