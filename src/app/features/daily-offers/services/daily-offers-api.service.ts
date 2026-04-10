import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreateDailyOfferRequest, DailyOfferDetail, DailyOfferListItem, OfferSearchFilter, OfferSearchItem, PagedResult, UpdateDailyOfferRequest } from '../models/daily-offer.model';

@Injectable({ providedIn: 'root' })
export class DailyOffersApiService {
  private readonly api = inject(ApiService);

  searchOffers(filter: OfferSearchFilter = {}): Observable<PagedResult<OfferSearchItem>> {
    let params = new HttpParams();
    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.city) params = params.set('city', filter.city);
    if (filter.minPrice != null) params = params.set('minPrice', filter.minPrice);
    if (filter.maxPrice != null) params = params.set('maxPrice', filter.maxPrice);
    params = params.set('page', filter.page ?? 1);
    params = params.set('pageSize', filter.pageSize ?? 20);
    return this.api.get<PagedResult<OfferSearchItem>>(`/search/offers?${params.toString()}`);
  }

  getActiveBusiness(businessId: number): Observable<DailyOfferListItem[]> {
    return this.api.get<DailyOfferListItem[]>(`/daily-offers/business/${businessId}`);
  }

  getActive(): Observable<DailyOfferDetail[]> {
    return this.api.get<DailyOfferDetail[]>('/daily-offers/active');
  }

  getById(id: number): Observable<DailyOfferDetail> {
    return this.api.get<DailyOfferDetail>(`/daily-offers/${id}`);
  }

  create(request: CreateDailyOfferRequest): Observable<DailyOfferDetail> {
    return this.api.post<DailyOfferDetail>('/daily-offers', request);
  }

  update(id: number, request: UpdateDailyOfferRequest): Observable<DailyOfferDetail> {
    return this.api.put<DailyOfferDetail>(`/daily-offers/${id}`, request);
  }

  activate(id: number): Observable<void> {
    return this.api.patch<void>(`/daily-offers/${id}/activate`, {});
  }

  deactivate(id: number): Observable<void> {
    return this.api.patch<void>(`/daily-offers/${id}/deactivate`, {});
  }

  publish(id: number): Observable<void> {
    return this.api.patch<void>(`/daily-offers/${id}/publish`, {});
  }

  unpublish(id: number): Observable<void> {
    return this.api.patch<void>(`/daily-offers/${id}/unpublish`, {});
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/daily-offers/${id}`);
  }
}
