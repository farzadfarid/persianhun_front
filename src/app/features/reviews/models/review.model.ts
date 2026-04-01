export interface ReviewListItem {
  id: number;
  businessId: number;
  appUserId: number;
  rating: number;
  title: string | null;
  status: string;
  createdAtUtc: string;
}

export interface ReviewDetail {
  id: number;
  businessId: number;
  appUserId: number;
  rating: number;
  title: string | null;
  comment: string | null;
  status: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface CreateReviewRequest {
  businessId: number;
  appUserId: number;
  rating: number;
  title: string | null;
  comment: string | null;
}
