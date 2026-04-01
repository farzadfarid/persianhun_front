import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent],
  templateUrl: './app-card.component.html',
  styleUrls: ['./app-card.component.scss'],
})
export class AppCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
