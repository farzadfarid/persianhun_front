export interface DealListItem {
  id: number;
  businessId: number;
  title: string;
  titleFa: string | null;
  slug: string;
  discountType: string; // 'Percentage' | 'FixedAmount'
  discountValue: number;
  validFromUtc: string | null;
  validToUtc: string | null;
  couponCode: string | null;
  coverImageUrl: string | null;
  isPublished: boolean;
}

export interface DealDetail {
  id: number;
  businessId: number;
  title: string;
  titleFa: string | null;
  slug: string;
  description: string | null;
  descriptionFa: string | null;
  termsAndConditions: string | null;
  termsAndConditionsFa: string | null;
  discountType: string;
  discountValue: number;
  originalPrice: number | null;
  discountedPrice: number | null;
  currency: string;
  validFromUtc: string | null;
  validToUtc: string | null;
  couponCode: string | null;
  coverImageUrl: string | null;
  isPublished: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface CreateDealRequest {
  businessId: number;
  title: string;
  titleFa: string | null;
  slug: string | null;
  description: string | null;
  descriptionFa: string | null;
  discountType: string;
  discountValue: number;
  originalPrice: number | null;
  discountedPrice: number | null;
  currency: string;
  validFromUtc: string | null;
  validToUtc: string | null;
  couponCode: string | null;
  termsAndConditions: string | null;
  termsAndConditionsFa: string | null;
  coverImageUrl: string | null;
}

export interface UpdateDealRequest {
  title: string;
  titleFa: string | null;
  description: string | null;
  descriptionFa: string | null;
  discountType: string;
  discountValue: number;
  originalPrice: number | null;
  discountedPrice: number | null;
  currency: string;
  validFromUtc: string | null;
  validToUtc: string | null;
  couponCode: string | null;
  termsAndConditions: string | null;
  termsAndConditionsFa: string | null;
  coverImageUrl: string | null;
}
