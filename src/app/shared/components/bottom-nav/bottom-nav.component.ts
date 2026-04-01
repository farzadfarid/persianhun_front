import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
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
  label: string;
  icon: string;
  route: string;
}

const OWNER_TABS: NavItem[] = [
  { label: 'Home', icon: 'home-outline', route: '/home' },
  { label: 'Businesses', icon: 'storefront-outline', route: '/businesses' },
  { label: 'My Biz', icon: 'business-outline', route: '/my-businesses' },
  { label: 'Plans', icon: 'card-outline', route: '/plans' },
  { label: 'Profile', icon: 'person-outline', route: '/profile' },
];

const USER_TABS: NavItem[] = [
  { label: 'Home', icon: 'home-outline', route: '/home' },
  { label: 'Businesses', icon: 'storefront-outline', route: '/businesses' },
  { label: 'Favorites', icon: 'heart-outline', route: '/favorites' },
  { label: 'Profile', icon: 'person-outline', route: '/profile' },
];

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IonIcon],
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
