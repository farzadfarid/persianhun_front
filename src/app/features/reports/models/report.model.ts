export enum ReferenceType {
  Business = 1,
  Event = 2,
  Deal = 3,
  DailyOffer = 7,
}

export interface CreateReportRequest {
  appUserId: number | null;
  referenceType: ReferenceType;
  referenceId: number;
  reason: string;
  details: string | null;
}

export interface ReportCreated {
  id: number;
  status: string;
  createdAtUtc: string;
}
