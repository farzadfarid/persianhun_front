export interface DailyOfferListItem {
  id: number;
  businessId: number;
  title: string;
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
  slug: string;
  description: string | null;
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

export interface CreateDailyOfferRequest {
  businessId: number;
  title: string;
  slug: string | null;
  description: string | null;
  discountType: string;
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
  description: string | null;
  discountType: string;
  discountValue: number;
  originalPrice: number | null;
  discountedPrice: number | null;
  currency: string;
  startsAtUtc: string;
  endsAtUtc: string;
  coverImageUrl: string | null;
}
