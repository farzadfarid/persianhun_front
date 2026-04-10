import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import { heartOutline, peopleOutline } from 'ionicons/icons';

import { BusinessFollowerDto } from '../../features/favorites/models/favorite.model';

import { FavoritesApiService } from '../../features/favorites/services/favorites-api.service';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-business-followers',
  standalone: true,
  imports: [TranslateModule, IonContent, IonIcon, IonSkeletonText, DatePipe, AppHeaderComponent],
  templateUrl: './business-followers.page.html',
  styleUrls: ['./business-followers.page.scss'],
})
export class BusinessFollowersPage implements OnInit {
  businessId = 0;
  followers: BusinessFollowerDto[] = [];
  isLoading = true;
  hasError = false;

  readonly skeletons = [1, 2, 3];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly favoritesApi: FavoritesApiService,
  ) {
    addIcons({ heartOutline, peopleOutline });
  }

  ngOnInit(): void {
    this.businessId = Number(this.route.snapshot.paramMap.get('businessId'));
    this.favoritesApi.getBusinessFollowers(this.businessId).subscribe({
      next: (items) => { this.followers = items; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }
}
