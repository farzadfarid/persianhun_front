export interface EventListItem {
  id: number;
  title: string;
  titleFa: string | null;
  slug: string;
  city: string | null;
  cityFa: string | null;
  startsAtUtc: string;
  isFree: boolean;
  price: number | null;
  currency: string | null;
  status: string;
  isPublished: boolean;
  coverImageUrl: string | null;
  businessId: number | null;
}

export interface EventDetail {
  id: number;
  title: string;
  titleFa: string | null;
  slug: string;
  description: string | null;
  descriptionFa: string | null;
  locationName: string | null;
  locationNameFa: string | null;
  addressLine: string | null;
  addressLineFa: string | null;
  city: string | null;
  cityFa: string | null;
  region: string | null;
  regionFa: string | null;
  postalCode: string | null;
  country: string | null;
  startsAtUtc: string;
  endsAtUtc: string | null;
  businessId: number | null;
  organizerName: string | null;
  organizerNameFa: string | null;
  organizerPhoneNumber: string | null;
  organizerEmail: string | null;
  coverImageUrl: string | null;
  isFree: boolean;
  price: number | null;
  currency: string | null;
  status: string;
  isPublished: boolean;
  createdByUserId: number | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface EventSearchItem {
  id: number;
  title: string;
  titleFa: string | null;
  slug: string;
  city: string | null;
  cityFa: string | null;
  startsAtUtc: string;
  endsAtUtc: string | null;
  isFree: boolean;
  price: number | null;
  currency: string | null;
  coverImageUrl: string | null;
}

export interface EventSearchFilter {
  keyword?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  isFree?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CreateEventRequest {
  title: string;
  titleFa: string | null;
  slug: string | null;
  description: string | null;
  descriptionFa: string | null;
  locationName: string | null;
  locationNameFa: string | null;
  addressLine: string | null;
  addressLineFa: string | null;
  city: string | null;
  cityFa: string | null;
  region: string | null;
  regionFa: string | null;
  postalCode: string | null;
  country: string | null;
  startsAtUtc: string;
  endsAtUtc: string | null;
  businessId: number | null;
  organizerName: string | null;
  organizerNameFa: string | null;
  organizerPhoneNumber: string | null;
  organizerEmail: string | null;
  coverImageUrl: string | null;
  isFree: boolean;
  price: number | null;
  currency: string | null;
  createdByUserId: number | null;
}

export interface UpdateEventRequest {
  title: string;
  titleFa: string | null;
  description: string | null;
  descriptionFa: string | null;
  locationName: string | null;
  locationNameFa: string | null;
  addressLine: string | null;
  addressLineFa: string | null;
  city: string | null;
  cityFa: string | null;
  region: string | null;
  regionFa: string | null;
  postalCode: string | null;
  country: string | null;
  startsAtUtc: string;
  endsAtUtc: string | null;
  businessId: number | null;
  organizerName: string | null;
  organizerNameFa: string | null;
  organizerPhoneNumber: string | null;
  organizerEmail: string | null;
  coverImageUrl: string | null;
  isFree: boolean;
  price: number | null;
  currency: string | null;
}
