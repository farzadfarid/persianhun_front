export interface FavoriteListItemDto {
  id: number;
  referenceType: ReferenceType;
  referenceId: number;
  createdAtUtc: string;
}

export interface AddFavoriteDto {
  appUserId: number;
  referenceType: ReferenceType;
  referenceId: number;
}

export enum ReferenceType {
  Business = 'Business',
  Event = 'Event',
  Deal = 'Deal',
  DailyOffer = 'DailyOffer',
}

export interface BusinessFollowerDto {
  appUserId: number;
  name: string;
  email: string;
  savedAtUtc: string;
}
