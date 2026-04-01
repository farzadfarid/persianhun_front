import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { SubscriptionPlanListItemDto } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanApiService {
  private readonly api = inject(ApiService);

  getActivePlans(): Observable<SubscriptionPlanListItemDto[]> {
    return this.api.get<SubscriptionPlanListItemDto[]>('/subscription-plans/active');
  }

  getPlanById(id: number): Observable<SubscriptionPlanListItemDto> {
    return this.api.get<SubscriptionPlanListItemDto>(`/subscription-plans/${id}`);
  }
}
