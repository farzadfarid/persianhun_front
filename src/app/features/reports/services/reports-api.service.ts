import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreateReportRequest, ReportCreated } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportsApiService {
  private readonly api = inject(ApiService);

  create(request: CreateReportRequest): Observable<ReportCreated> {
    return this.api.post<ReportCreated>('/reports', request);
  }
}
