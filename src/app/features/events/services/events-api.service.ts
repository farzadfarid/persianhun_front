import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreateEventRequest, EventDetail, EventListItem, EventSearchFilter, EventSearchItem, UpdateEventRequest } from '../models/event.model';
import { PagedResult } from '../../daily-offers/models/daily-offer.model';

@Injectable({ providedIn: 'root' })
export class EventsApiService {
  private readonly api = inject(ApiService);

  searchEvents(filter: EventSearchFilter = {}): Observable<PagedResult<EventSearchItem>> {
    let params = new HttpParams();
    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.city) params = params.set('city', filter.city);
    if (filter.isFree != null) params = params.set('isFree', filter.isFree);
    if (filter.minPrice != null) params = params.set('minPrice', filter.minPrice);
    if (filter.maxPrice != null) params = params.set('maxPrice', filter.maxPrice);
    params = params.set('page', filter.page ?? 1);
    params = params.set('pageSize', filter.pageSize ?? 20);
    return this.api.get<PagedResult<EventSearchItem>>(`/search/events?${params.toString()}`);
  }

  getPublished(): Observable<EventListItem[]> {
    return this.api.get<EventListItem[]>('/events/published');
  }

  getByBusiness(businessId: number): Observable<EventListItem[]> {
    return this.api.get<EventListItem[]>(`/events/business/${businessId}`);
  }

  getById(id: number): Observable<EventDetail> {
    return this.api.get<EventDetail>(`/events/${id}`);
  }

  create(request: CreateEventRequest): Observable<EventDetail> {
    return this.api.post<EventDetail>('/events', request);
  }

  update(id: number, request: UpdateEventRequest): Observable<EventDetail> {
    return this.api.put<EventDetail>(`/events/${id}`, request);
  }

  publish(id: number): Observable<void> {
    return this.api.patch<void>(`/events/${id}/publish`, {});
  }

  unpublish(id: number): Observable<void> {
    return this.api.patch<void>(`/events/${id}/unpublish`, {});
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/events/${id}`);
  }
}
