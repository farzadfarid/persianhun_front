export interface DailyOfferListItem {
  id: number;
  businessId: number;
  title: string;
  titleFa: string | null;
  slug: string;
  discountType: string;
  discountValue: number;
  startsAtUtc: string;
  endsAtUtc: string;
  isActive: boolean;
  isPublished: boolean;
  coverImageUrl: string | null;
}

export interface DailyOfferDetail {
  id: number;
  businessId: number;
  title: string;
  titleFa: string | null;
  slug: string;
  description: string | null;
  descriptionFa: string | null;
  discountType: string;
  discountValue: number;
  originalPrice: number | null;
  discountedPrice: number | null;
  currency: string;
  startsAtUtc: string;
  endsAtUtc: string;
  isActive: boolean;
  isPublished: boolean;
  coverImageUrl: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface OfferSearchItem {
  id: number;
  businessId: number;
  businessName: string;
  businessNameFa: string | null;
  businessSlug: string;
  title: string;
  titleFa: string | null;
  slug: string;
  originalPrice: number | null;
  discountedPrice: number | null;
  discountValue: number;
  currency: string;
  endsAtUtc: string;
  coverImageUrl: string | null;
}

export interface OfferSearchFilter {
  keyword?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export type DiscountType = 'Percentage' | 'FixedAmount';

export interface CreateDailyOfferRequest {
  businessId: number;
  title: string;
  titleFa: string | null;
  slug: string | null;
  description: string | null;
  descriptionFa: string | null;
  discountType: DiscountType;
  discountValue: number;
  originalPrice: number | null;
  discountedPrice: number | null;
  currency: string;
  startsAtUtc: string;
  endsAtUtc: string;
  coverImageUrl: string | null;
}

export interface UpdateDailyOfferRequest {
  title: string;
  titleFa: string | null;
  description: string | null;
  descriptionFa: string | null;
  discountType: DiscountType;
  discountValue: number;
  originalPrice: number | null;
  discountedPrice: number | null;
  currency: string;
  startsAtUtc: string;
  endsAtUtc: string;
  coverImageUrl: string | null;
}
