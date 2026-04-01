import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreateEventRequest, EventDetail, EventListItem, UpdateEventRequest } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventsApiService {
  private readonly api = inject(ApiService);

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
