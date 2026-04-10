import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreateDealRequest, DealDetail, DealListItem, UpdateDealRequest } from '../models/deal.model';

@Injectable({ providedIn: 'root' })
export class DealsApiService {
  private readonly api = inject(ApiService);

  getActive(): Observable<DealListItem[]> {
    return this.api.get<DealListItem[]>('/deals/active');
  }

  getByBusiness(businessId: number): Observable<DealListItem[]> {
    return this.api.get<DealListItem[]>(`/deals/business/${businessId}`);
  }

  getById(id: number): Observable<DealDetail> {
    return this.api.get<DealDetail>(`/deals/${id}`);
  }

  create(request: CreateDealRequest): Observable<DealDetail> {
    return this.api.post<DealDetail>('/deals', request);
  }

  update(id: number, request: UpdateDealRequest): Observable<DealDetail> {
    return this.api.put<DealDetail>(`/deals/${id}`, request);
  }

  publish(id: number): Observable<void> {
    return this.api.patch<void>(`/deals/${id}/publish`, {});
  }

  unpublish(id: number): Observable<void> {
    return this.api.patch<void>(`/deals/${id}/unpublish`, {});
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/deals/${id}`);
  }
}
