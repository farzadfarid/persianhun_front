import { Component } from '@angular/core';
import { IonMenu, IonRouterOutlet } from '@ionic/angular/standalone';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { AppSideMenuComponent } from '../../shared/components/app-side-menu/app-side-menu.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [IonRouterOutlet, IonMenu, BottomNavComponent, AppSideMenuComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {}
