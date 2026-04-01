import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  businessOutline,
  personOutline,
  heartOutline,
  notificationsOutline,
  briefcaseOutline,
  addCircleOutline,
  cardOutline,
  logInOutline,
  logOutOutline,
  personAddOutline,
  calendarOutline,
  pricetagOutline,
  bulbOutline,
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { AuthUser } from '../../../core/models/auth.model';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  roles: 'all' | 'auth' | 'BusinessOwner';
}

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
  ],
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss'],
})
export class AppSideMenuComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  readonly fileUpload = inject(FileUploadService);

  currentUser: AuthUser | null = null;
  profileImageUrl: string | null = null;
  fullName: string | null = null;
  private sub!: Subscription;

  readonly menuItems: MenuItem[] = [
    { label: 'Home', route: '/home', icon: 'home-outline', roles: 'all' },
    { label: 'Businesses', route: '/businesses', icon: 'business-outline', roles: 'all' },
    { label: 'Events', route: '/events', icon: 'calendar-outline', roles: 'all' },
    { label: 'Offers', route: '/offers', icon: 'pricetag-outline', roles: 'all' },
    { label: 'Profile', route: '/profile', icon: 'person-outline', roles: 'auth' },
    { label: 'Favorites', route: '/favorites', icon: 'heart-outline', roles: 'auth' },
    { label: 'Notifications', route: '/notifications', icon: 'notifications-outline', roles: 'auth' },
    { label: 'Suggest a Business', route: '/suggest-business', icon: 'bulb-outline', roles: 'auth' },
    { label: 'My Businesses', route: '/my-businesses', icon: 'briefcase-outline', roles: 'BusinessOwner' },
    { label: 'Create Business', route: '/create-business', icon: 'add-circle-outline', roles: 'BusinessOwner' },
    { label: 'Plans', route: '/plans', icon: 'card-outline', roles: 'BusinessOwner' },
  ];

  constructor() {
    addIcons({
      homeOutline,
      businessOutline,
      personOutline,
      heartOutline,
      notificationsOutline,
      briefcaseOutline,
      addCircleOutline,
      cardOutline,
      logInOutline,
      logOutOutline,
      personAddOutline,
      calendarOutline,
      pricetagOutline,
      bulbOutline,
    });
  }

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.api.get<{ firstName: string; lastName: string; profileImageUrl: string | null }>('/users/me').subscribe({
          next: (profile) => {
            this.fullName = `${profile.firstName} ${profile.lastName}`.trim();
            this.profileImageUrl = profile.profileImageUrl;
          },
        });
      } else {
        this.fullName = null;
        this.profileImageUrl = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get visibleItems(): MenuItem[] {
    return this.menuItems.filter((item) => {
      if (item.roles === 'all') return true;
      if (item.roles === 'auth') return !!this.currentUser;
      if (item.roles === 'BusinessOwner') return this.currentUser?.role === 'BusinessOwner';
      return false;
    });
  }

  get userInitials(): string {
    if (!this.currentUser?.email) return '?';
    return this.currentUser.email.charAt(0).toUpperCase();
  }

  get roleBadge(): string {
    if (this.currentUser?.role === 'BusinessOwner') return 'Business Owner';
    if (this.currentUser?.role === 'User') return 'Member';
    return '';
  }

  logout(): void {
    this.auth.logout();
  }

  navigate(route: string): void {
    this.router.navigateByUrl(route);
  }
}
