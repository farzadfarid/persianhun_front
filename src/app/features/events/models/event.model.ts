export interface EventListItem {
  id: number;
  title: string;
  slug: string;
  city: string | null;
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
  slug: string;
  description: string | null;
  locationName: string | null;
  addressLine: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  startsAtUtc: string;
  endsAtUtc: string | null;
  businessId: number | null;
  organizerName: string | null;
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

export interface CreateEventRequest {
  title: string;
  slug: string | null;
  description: string | null;
  locationName: string | null;
  addressLine: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  startsAtUtc: string;
  endsAtUtc: string | null;
  businessId: number | null;
  organizerName: string | null;
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
  description: string | null;
  locationName: string | null;
  addressLine: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  startsAtUtc: string;
  endsAtUtc: string | null;
  businessId: number | null;
  organizerName: string | null;
  organizerPhoneNumber: string | null;
  organizerEmail: string | null;
  coverImageUrl: string | null;
  isFree: boolean;
  price: number | null;
  currency: string | null;
}
