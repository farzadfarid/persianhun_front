import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AddFavoriteDto, BusinessFollowerDto, FavoriteListItemDto, ReferenceType } from '../models/favorite.model';

@Injectable({ providedIn: 'root' })
export class FavoritesApiService {
  private readonly api = inject(ApiService);

  getUserFavorites(userId: number): Observable<FavoriteListItemDto[]> {
    return this.api.get<FavoriteListItemDto[]>(`/favorites/user/${userId}`);
  }

  addFavorite(appUserId: number, referenceType: ReferenceType, referenceId: number): Observable<FavoriteListItemDto> {
    const body: AddFavoriteDto = { appUserId, referenceType, referenceId };
    return this.api.post<FavoriteListItemDto>('/favorites', body);
  }

  removeFavorite(favoriteId: number): Observable<void> {
    return this.api.delete<void>(`/favorites/${favoriteId}`);
  }

  getCount(referenceType: ReferenceType, referenceId: number): Observable<number> {
    return this.api.get<{ count: number }>(`/favorites/count/${referenceType}/${referenceId}`)
      .pipe(map(r => r.count));
  }

  getBusinessFollowers(businessId: number): Observable<BusinessFollowerDto[]> {
    return this.api.get<BusinessFollowerDto[]>(`/favorites/business/${businessId}/followers`);
  }
}
