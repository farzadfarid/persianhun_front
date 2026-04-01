import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [IonContent, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent {}
