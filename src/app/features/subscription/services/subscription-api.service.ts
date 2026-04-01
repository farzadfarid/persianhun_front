import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { SubscriptionDto } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionApiService {
  private readonly api = inject(ApiService);

  createSubscription(businessId: number, subscriptionPlanId: number, autoRenew: boolean): Observable<SubscriptionDto> {
    return this.api.post<SubscriptionDto>('/subscriptions', { businessId, subscriptionPlanId, autoRenew });
  }

  getActiveSubscription(businessId: number): Observable<SubscriptionDto> {
    return this.api.getSilent<SubscriptionDto>(`/businesses/${businessId}/subscriptions/active`);
  }

  cancel(subscriptionId: number): Observable<void> {
    return this.api.post<void>(`/subscriptions/${subscriptionId}/cancel`, {});
  }
}
