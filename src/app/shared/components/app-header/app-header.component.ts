import { Component, Input } from '@angular/core';
import { IonBackButton, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  @Input() title = '';
  @Input() showBack = false;
  @Input() showMenu = false;
  @Input() defaultBackHref = '/';
}
