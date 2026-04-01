import { Component, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircle,
  alertCircle,
  informationCircle,
  warningOutline,
  closeOutline,
} from 'ionicons/icons';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './app-toast.component.html',
  styleUrls: ['./app-toast.component.scss'],
})
export class AppToastComponent {
  readonly toastService = inject(ToastService);

  constructor() {
    addIcons({ checkmarkCircle, alertCircle, informationCircle, warningOutline, closeOutline });
  }

  get toasts() {
    return this.toastService.toasts();
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  iconFor(type: string): string {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'warning-outline';
      default: return 'information-circle';
    }
  }
}
