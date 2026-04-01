import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { BusinessSuggestionListItem, CreateBusinessSuggestionPayload } from '../models/business-suggestion.model';

@Injectable({ providedIn: 'root' })
export class BusinessSuggestionsApiService {
  private readonly api = inject(ApiService);

  create(payload: CreateBusinessSuggestionPayload): Observable<{ id: number }> {
    return this.api.post<{ id: number }>('/business-suggestions', payload);
  }

  getByUser(userId: number): Observable<BusinessSuggestionListItem[]> {
    return this.api.get<BusinessSuggestionListItem[]>(`/business-suggestions/user/${userId}`);
  }
}
