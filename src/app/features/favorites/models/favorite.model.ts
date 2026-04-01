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
  Business = 1,
  Event = 2,
  Deal = 3,
  DailyOffer = 7,
}
