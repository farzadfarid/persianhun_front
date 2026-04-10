import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ContactRequestDetail, ContactRequestListItem, CreateContactRequestPayload } from '../models/contact-request.model';

@Injectable({ providedIn: 'root' })
export class ContactRequestsApiService {
  private readonly api = inject(ApiService);

  create(payload: CreateContactRequestPayload): Observable<ContactRequestDetail> {
    return this.api.post<ContactRequestDetail>('/contact-requests', payload);
  }

  getById(id: number): Observable<ContactRequestDetail> {
    return this.api.get<ContactRequestDetail>(`/contact-requests/${id}`);
  }

  getByBusiness(businessId: number): Observable<ContactRequestListItem[]> {
    return this.api.get<ContactRequestListItem[]>(`/contact-requests/business/${businessId}`);
  }

  getByUser(userId: number): Observable<ContactRequestListItem[]> {
    return this.api.get<ContactRequestListItem[]>(`/contact-requests/user/${userId}`);
  }
}
