import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { heartOutline, trashOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { BusinessDetails } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { FavoriteListItemDto, ReferenceType } from '../../features/favorites/models/favorite.model';
import { FavoritesApiService } from '../../features/favorites/services/favorites-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

export interface FavoriteBusinessItem {
  favoriteId: number;
  business: BusinessDetails;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonContent, IonIcon, NgIf, NgFor, RouterLink, TranslateModule, AppHeaderComponent],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly favoritesApi = inject(FavoritesApiService);
  private readonly businessApi = inject(BusinessApiService);
  readonly lang = inject(LanguageService);

  items: FavoriteBusinessItem[] = [];
  isLoading = true;
  hasError = false;

  constructor() {
    addIcons({ heartOutline, trashOutline });
  }

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (!user) { this.isLoading = false; return; }

    this.favoritesApi.getUserFavorites(user.userId).subscribe({
      next: (favorites) => {
        const businessFavorites = favorites.filter(f => f.referenceType === ReferenceType.Business);
        if (businessFavorites.length === 0) { this.isLoading = false; return; }

        const requests = businessFavorites.map((f) =>
          this.businessApi.getById(f.referenceId).pipe(catchError(() => of(null)))
        );

        forkJoin(requests).subscribe({
          next: (businesses) => {
            this.items = businessFavorites
              .map((f, i) => ({ fav: f, biz: businesses[i] }))
              .filter((x): x is { fav: FavoriteListItemDto; biz: BusinessDetails } => x.biz !== null)
              .map((x) => ({ favoriteId: x.fav.id, business: x.biz }));
            this.isLoading = false;
          },
          error: () => { this.hasError = true; this.isLoading = false; },
        });
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  removeFavorite(favoriteId: number): void {
    this.favoritesApi.removeFavorite(favoriteId).subscribe({
      next: () => { this.items = this.items.filter((i) => i.favoriteId !== favoriteId); },
      error: () => {},
    });
  }

  readonly skeletons = [1, 2, 3, 4];
}
