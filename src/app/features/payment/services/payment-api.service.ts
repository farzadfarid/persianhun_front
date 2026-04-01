import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreatePaymentRequestDto, PaymentInitiatedDto, PaymentResultDto } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private readonly api = inject(ApiService);

  createPayment(request: CreatePaymentRequestDto): Observable<PaymentInitiatedDto> {
    return this.api.post<PaymentInitiatedDto>('/payments/create', request);
  }

  handleCallback(authority: string, status: string): Observable<PaymentResultDto> {
    return this.api.get<PaymentResultDto>(`/payments/callback?authority=${encodeURIComponent(authority)}&status=${encodeURIComponent(status)}`);
  }

  getPaymentStatus(subscriptionId: number): Observable<PaymentResultDto> {
    return this.api.get<PaymentResultDto>(`/payments/status/${subscriptionId}`);
  }
}
