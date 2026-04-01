export type ContactType = 'Call' | 'Message' | 'WhatsApp' | 'FormSubmit' | 'ClickToContact';

export interface CreateContactRequestPayload {
  businessId: number;
  appUserId: number | null;
  name: string;
  email: string;
  phoneNumber: string | null;
  message: string | null;
  contactType: ContactType;
}

export interface ContactRequestListItem {
  id: number;
  businessId: number;
  appUserId: number | null;
  name: string;
  contactType: ContactType;
  status: string;
  isConverted: boolean;
  createdAtUtc: string;
}

export interface ContactRequestDetail {
  id: number;
  businessId: number;
  appUserId: number | null;
  name: string;
  email: string;
  phoneNumber: string | null;
  message: string | null;
  contactType: ContactType;
  status: string;
  isConverted: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}
