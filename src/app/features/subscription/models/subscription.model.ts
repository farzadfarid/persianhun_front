export interface SubscriptionPlanListItemDto {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  maxImages: number;
  canBeFeatured: boolean;
  priorityInSearch: number;
  allowsDeals: boolean;
  allowsAnalytics: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface SubscriptionDto {
  id: number;
  businessId: number;
  subscriptionPlanId: number;
  planName: string;
  planCode: string;
  startDateUtc: string;
  endDateUtc: string;
  status: SubscriptionStatus;
  paymentStatus: PaymentStatus;
  autoRenew: boolean;
  externalReference: string | null;
  paymentReference: string | null;
  activatedAtUtc: string | null;
  createdAtUtc: string;
}

export enum SubscriptionStatus {
  Pending = 'Pending',
  Active = 'Active',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Failed = 'Failed',
  Refunded = 'Refunded',
}
