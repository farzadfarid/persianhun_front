import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, starHalf } from 'ionicons/icons';
import { BusinessSearchItem } from '../../models/business.model';
import { UploadUrlPipe } from '../../../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [RouterLink, IonIcon, UploadUrlPipe],
  templateUrl: './business-card.component.html',
  styleUrls: ['./business-card.component.scss'],
})
export class BusinessCardComponent {
  @Input({ required: true }) business!: BusinessSearchItem;

  constructor() {
    addIcons({ checkmarkCircle, starHalf });
  }
}
