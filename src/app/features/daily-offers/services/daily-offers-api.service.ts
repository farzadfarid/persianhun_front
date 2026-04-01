import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreateDailyOfferRequest, DailyOfferDetail, DailyOfferListItem, UpdateDailyOfferRequest } from '../models/daily-offer.model';

@Injectable({ providedIn: 'root' })
export class DailyOffersApiService {
  private readonly api = inject(ApiService);

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
