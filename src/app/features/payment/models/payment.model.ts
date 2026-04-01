import { PaymentStatus } from '../../subscription/models/subscription.model';

export interface CreatePaymentRequestDto {
  businessId: number;
  subscriptionPlanId: number;
  autoRenew: boolean;
  callbackUrl: string;
}

export interface PaymentInitiatedDto {
  subscriptionId: number;
  authority: string;
  paymentUrl: string;
}

export interface PaymentResultDto {
  subscriptionId: number;
  success: boolean;
  paymentStatus: PaymentStatus;
  paymentReference: string | null;
  message: string;
}
