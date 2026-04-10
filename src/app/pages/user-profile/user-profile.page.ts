import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  businessOutline, cardOutline, chevronForwardOutline,
  heartOutline, logOutOutline, notificationsOutline,
  personCircleOutline, starOutline, bulbOutline,
  cameraOutline,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { FileUploadService } from '../../core/services/file-upload.service';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { LanguageService } from '../../core/services/language.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

interface UserProfileDto {
  profileImageUrl: string | null;
  firstName: string | null;
  firstNameFa: string | null;
  lastName: string | null;
  lastNameFa: string | null;
  displayName: string | null;
  displayNameFa: string | null;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [IonContent, IonIcon, RouterLink, TranslateModule, AppHeaderComponent, AppButtonComponent],
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  readonly auth = inject(AuthService);
  readonly fileUpload = inject(FileUploadService);
  readonly lang = inject(LanguageService);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  profileImageUrl: string | null = null;
  uploadingPhoto = false;

  firstName: string | null = null;
  firstNameFa: string | null = null;
  lastName: string | null = null;
  lastNameFa: string | null = null;
  displayName: string | null = null;
  displayNameFa: string | null = null;

  get displayedName(): string {
    const en = this.displayName || [this.firstName, this.lastName].filter(Boolean).join(' ') || null;
    const fa = this.displayNameFa || [this.firstNameFa, this.lastNameFa].filter(Boolean).join(' ') || null;
    return this.lang.pick(en, fa) || this.auth.currentUser?.email || '';
  }

  get nameInitial(): string {
    return (this.displayedName || this.auth.currentUser?.email || 'U')[0].toUpperCase();
  }

  constructor() {
    addIcons({
      businessOutline, cardOutline, chevronForwardOutline,
      logOutOutline, heartOutline, notificationsOutline,
      personCircleOutline, starOutline, bulbOutline, cameraOutline,
    });
  }

  ngOnInit(): void {
    if (this.auth.currentUser) {
      this.api.get<UserProfileDto>('/users/me').subscribe({
        next: (profile) => {
          this.profileImageUrl = profile.profileImageUrl;
          this.firstName = profile.firstName;
          this.firstNameFa = profile.firstNameFa;
          this.lastName = profile.lastName;
          this.lastNameFa = profile.lastNameFa;
          this.displayName = profile.displayName;
          this.displayNameFa = profile.displayNameFa;
        },
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
