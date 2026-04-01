import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonContent, AppHeaderComponent],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {}
