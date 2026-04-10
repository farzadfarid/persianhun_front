import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ReportsApiService } from '../../features/reports/services/reports-api.service';
import { ReferenceType } from '../../features/reports/models/report.model';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [FormsModule, IonContent, TranslateModule, AppHeaderComponent, AppButtonComponent],
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  referenceType: ReferenceType = ReferenceType.Business;
  referenceId = 0;
  reason = '';
  details = '';
  submitting = false;
  submitted = false;

  readonly reasons = [
    'Spam',
    'Inappropriate content',
    'Misleading information',
    'Fake listing',
    'Other',
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly reportsApi: ReportsApiService,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.referenceType = Number(params.get('type')) as ReferenceType;
    this.referenceId = Number(params.get('id'));
  }

  submit(): void {
    if (!this.reason || this.submitting) return;
    this.submitting = true;
    const user = this.auth.currentUser;
    this.reportsApi.create({
      appUserId: user?.userId ?? null,
      referenceType: this.referenceType,
      referenceId: this.referenceId,
      reason: this.reason,
      details: this.details.trim() || null,
    }).subscribe({
      next: () => {
        this.submitted = true;
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/home']), 2000);
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}
