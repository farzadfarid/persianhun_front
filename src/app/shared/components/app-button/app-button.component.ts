import { Component, Input } from '@angular/core';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [IonButton, IonSpinner],
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
})
export class AppButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() expand: 'block' | 'full' | undefined = 'block';
  @Input() fill: 'solid' | 'outline' | 'clear' = 'solid';
  @Input() color: 'primary' | 'danger' | 'medium' = 'danger';
  @Input() disabled = false;
  @Input() loading = false;
}
