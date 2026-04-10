import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  storefrontOutline,
  businessOutline,
  cardOutline,
  heartOutline,
  personOutline,
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  labelKey: string;
  icon: string;
  route: string;
}

const OWNER_TABS: NavItem[] = [
  { labelKey: 'NAV.HOME', icon: 'home-outline', route: '/home' },
  { labelKey: 'NAV.BUSINESSES', icon: 'storefront-outline', route: '/businesses' },
  { labelKey: 'NAV.MY_BIZ', icon: 'business-outline', route: '/my-businesses' },
  { labelKey: 'NAV.PLANS', icon: 'card-outline', route: '/plans' },
  { labelKey: 'NAV.PROFILE', icon: 'person-outline', route: '/profile' },
];

const USER_TABS: NavItem[] = [
  { labelKey: 'NAV.HOME', icon: 'home-outline', route: '/home' },
  { labelKey: 'NAV.BUSINESSES', icon: 'storefront-outline', route: '/businesses' },
  { labelKey: 'NAV.FAVORITES', icon: 'heart-outline', route: '/favorites' },
  { labelKey: 'NAV.PROFILE', icon: 'person-outline', route: '/profile' },
];

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IonIcon, TranslateModule],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private sub!: Subscription;

  navItems: NavItem[] = USER_TABS;

  constructor() {
    addIcons({
      homeOutline,
      storefrontOutline,
      businessOutline,
      cardOutline,
      heartOutline,
      personOutline,
    });
  }

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe((user) => {
      this.navItems = user?.role === 'BusinessOwner' ? OWNER_TABS : USER_TABS;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
