import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  BusinessDetails,
  BusinessImageDto,
  BusinessSearchFilter,
  BusinessSearchItem,
  CreateBusinessRequest,
  PagedResult,
  UpdateBusinessRequest,
} from '../models/business.model';

@Injectable({ providedIn: 'root' })
export class BusinessApiService {
  private readonly api = inject(ApiService);

  searchBusinesses(
    filter: BusinessSearchFilter = {}
  ): Observable<PagedResult<BusinessSearchItem>> {
    let params = new HttpParams();
    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.city) params = params.set('city', filter.city);
    params = params.set('page', filter.page ?? 1);
    params = params.set('pageSize', filter.pageSize ?? 20);
    return this.api.get<PagedResult<BusinessSearchItem>>(
      `/search/businesses?${params.toString()}`
    );
  }

  getById(id: number): Observable<BusinessDetails> {
    return this.api.get<BusinessDetails>(`/businesses/${id}`);
  }

  getMyBusinesses(): Observable<BusinessSearchItem[]> {
    return this.api.get<BusinessSearchItem[]>('/businesses/my');
  }

  create(request: CreateBusinessRequest): Observable<BusinessDetails> {
    return this.api.post<BusinessDetails>('/businesses', request);
  }

  update(id: number, request: UpdateBusinessRequest): Observable<BusinessDetails> {
    return this.api.put<BusinessDetails>(`/businesses/${id}`, request);
  }

  setStatus(id: number, isActive: boolean): Observable<void> {
    return this.api.patch<void>(`/businesses/${id}/status`, { isActive });
  }

  getImages(businessId: number): Observable<BusinessImageDto[]> {
    return this.api.get<BusinessImageDto[]>(`/businesses/${businessId}/images`);
  }

  addImage(businessId: number, imageUrl: string, altText: string | null, isCover: boolean): Observable<BusinessImageDto> {
    return this.api.post<BusinessImageDto>(`/businesses/${businessId}/images`, { imageUrl, altText, isCover });
  }

  removeImage(businessId: number, imageId: number): Observable<void> {
    return this.api.delete<void>(`/businesses/${businessId}/images/${imageId}`);
  }

  setCoverImage(businessId: number, imageId: number): Observable<void> {
    return this.api.patch<void>(`/businesses/${businessId}/images/${imageId}/cover`, {});
  }
}
