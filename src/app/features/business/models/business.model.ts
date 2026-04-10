export interface BusinessImageDto {
  id: number;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
  isCover: boolean;
}

export interface BusinessSearchItem {
  id: number;
  name: string;
  nameFa: string | null;
  slug: string;
  city: string | null;
  cityFa: string | null;
  phoneNumber: string | null;
  logoUrl: string | null;
  isVerified: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
}

export interface BusinessDetails {
  id: number;
  name: string;
  nameFa: string | null;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  descriptionFa: string | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
  instagramUrl: string | null;
  telegramUrl: string | null;
  whatsAppNumber: string | null;
  addressLine: string | null;
  addressLineFa: string | null;
  city: string | null;
  cityFa: string | null;
  region: string | null;
  regionFa: string | null;
  postalCode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  isVerified: boolean;
  isClaimed: boolean;
  isFeatured: boolean;
  isActive: boolean;
  ownerUserId: number | null;
  createdAtUtc: string;
  updatedAtUtc: string;
  images: BusinessImageDto[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface BusinessSearchFilter {
  keyword?: string;
  city?: string;
  page?: number;
  pageSize?: number;
}

export interface UpdateBusinessRequest {
  name: string;
  nameFa: string | null;
  description: string | null;
  descriptionFa: string | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
  instagramUrl: string | null;
  telegramUrl: string | null;
  whatsAppNumber: string | null;
  addressLine: string | null;
  addressLineFa: string | null;
  city: string | null;
  cityFa: string | null;
  region: string | null;
  regionFa: string | null;
  postalCode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  logoUrl: string | null;
}

export interface CreateBusinessRequest {
  name: string;
  nameFa: string | null;
  slug: string | null;
  description: string | null;
  descriptionFa: string | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
  instagramUrl: string | null;
  telegramUrl: string | null;
  whatsAppNumber: string | null;
  addressLine: string | null;
  addressLineFa: string | null;
  city: string | null;
  cityFa: string | null;
  region: string | null;
  regionFa: string | null;
  postalCode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  logoUrl: string | null;
}
