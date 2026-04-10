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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  ticketOutline,
  starOutline,
  mailOutline,
  chatbubbleOutline,
  languageOutline,
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { AuthUser } from '../../../core/models/auth.model';
import { LanguageService } from '../../../core/services/language.service';

interface MenuItem {
  labelKey: string;
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
    TranslateModule,
  ],
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss'],
})
export class AppSideMenuComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  readonly fileUpload = inject(FileUploadService);
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  currentUser: AuthUser | null = null;
  profileImageUrl: string | null = null;
  firstName: string | null = null;
  firstNameFa: string | null = null;
  lastName: string | null = null;
  lastNameFa: string | null = null;
  displayName: string | null = null;
  displayNameFa: string | null = null;
  private sub!: Subscription;

  get displayedName(): string {
    const en = this.displayName || [this.firstName, this.lastName].filter(Boolean).join(' ') || null;
    const fa = this.displayNameFa || [this.firstNameFa, this.lastNameFa].filter(Boolean).join(' ') || null;
    return this.lang.pick(en, fa) || this.currentUser?.email || '';
  }

  readonly menuItems: MenuItem[] = [
    { labelKey: 'MENU.HOME', route: '/home', icon: 'home-outline', roles: 'all' },
    { labelKey: 'MENU.BUSINESSES', route: '/businesses', icon: 'business-outline', roles: 'all' },
    { labelKey: 'MENU.EVENTS', route: '/events', icon: 'calendar-outline', roles: 'all' },
    { labelKey: 'MENU.OFFERS', route: '/offers', icon: 'pricetag-outline', roles: 'all' },
    { labelKey: 'MENU.DEALS', route: '/deals', icon: 'ticket-outline', roles: 'all' },
    { labelKey: 'MENU.PROFILE', route: '/profile', icon: 'person-outline', roles: 'auth' },
    { labelKey: 'MENU.FAVORITES', route: '/favorites', icon: 'heart-outline', roles: 'auth' },
    { labelKey: 'MENU.NOTIFICATIONS', route: '/notifications', icon: 'notifications-outline', roles: 'auth' },
    { labelKey: 'MENU.MY_REVIEWS', route: '/my-reviews', icon: 'star-outline', roles: 'auth' },
    { labelKey: 'MENU.SUGGEST_BUSINESS', route: '/suggest-business', icon: 'bulb-outline', roles: 'auth' },
    { labelKey: 'MENU.MY_BUSINESSES', route: '/my-businesses', icon: 'briefcase-outline', roles: 'BusinessOwner' },
    { labelKey: 'MENU.CREATE_BUSINESS', route: '/create-business', icon: 'add-circle-outline', roles: 'BusinessOwner' },
    { labelKey: 'MENU.PLANS', route: '/plans', icon: 'card-outline', roles: 'BusinessOwner' },
    { labelKey: 'MENU.MY_DEALS', route: '/my-deals', icon: 'ticket-outline', roles: 'BusinessOwner' },
    { labelKey: 'MENU.MY_OFFERS', route: '/my-offers', icon: 'pricetag-outline', roles: 'BusinessOwner' },
    { labelKey: 'MENU.MY_EVENTS', route: '/my-events', icon: 'calendar-outline', roles: 'BusinessOwner' },
    { labelKey: 'MENU.CONTACT_REQUESTS', route: '/my-contact-requests', icon: 'mail-outline', roles: 'BusinessOwner' },
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
      ticketOutline,
      starOutline,
      mailOutline,
      chatbubbleOutline,
      languageOutline,
    });
  }

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.api.get<{
          firstName: string | null; firstNameFa: string | null;
          lastName: string | null; lastNameFa: string | null;
          displayName: string | null; displayNameFa: string | null;
          profileImageUrl: string | null;
        }>('/users/me').subscribe({
          next: (profile) => {
            this.firstName = profile.firstName;
            this.firstNameFa = profile.firstNameFa;
            this.lastName = profile.lastName;
            this.lastNameFa = profile.lastNameFa;
            this.displayName = profile.displayName;
            this.displayNameFa = profile.displayNameFa;
            this.profileImageUrl = profile.profileImageUrl;
          },
        });
      } else {
        this.firstName = null;
        this.firstNameFa = null;
        this.lastName = null;
        this.lastNameFa = null;
        this.displayName = null;
        this.displayNameFa = null;
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
    return (this.displayedName || this.currentUser?.email || '?').charAt(0).toUpperCase();
  }

  get roleBadgeKey(): string {
    if (this.currentUser?.role === 'BusinessOwner') return 'MENU.ROLE_OWNER';
    if (this.currentUser?.role === 'User') return 'MENU.ROLE_MEMBER';
    return '';
  }

  toggleLanguage(): void {
    this.lang.toggle();
  }

  logout(): void {
    this.auth.logout();
  }

  navigate(route: string): void {
    this.router.navigateByUrl(route);
  }
}
