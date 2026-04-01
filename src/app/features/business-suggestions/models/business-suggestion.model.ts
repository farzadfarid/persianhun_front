export interface CreateBusinessSuggestionPayload {
  suggestedByUserId: number | null;
  businessName: string;
  categoryText: string | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
  addressLine: string | null;
  city: string | null;
  description: string | null;
}

export interface BusinessSuggestionListItem {
  id: number;
  suggestedByUserId: number | null;
  businessName: string;
  status: string;
  createdAtUtc: string;
}
