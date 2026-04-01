import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeCircleOutline } from 'ionicons/icons';
import { SubscriptionPlanListItemDto } from '../../features/subscription/models/subscription.model';
import { SubscriptionPlanApiService } from '../../features/subscription/services/subscription-plan-api.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-plans-list',
  standalone: true,
  imports: [IonContent, IonIcon, IonSkeletonText, NgIf, NgFor, AppHeaderComponent, AppButtonComponent],
  templateUrl: './plans-list.page.html',
  styleUrls: ['./plans-list.page.scss'],
})
export class PlansListPage implements OnInit {
  plans: SubscriptionPlanListItemDto[] = [];
  isLoading = true;
  hasError = false;
  businessId: number | null = null;

  constructor(
    private readonly planApi: SubscriptionPlanApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    addIcons({ checkmarkOutline, closeCircleOutline });
  }

  ngOnInit(): void {
    const bid = this.route.snapshot.queryParamMap.get('businessId');
    this.businessId = bid ? Number(bid) : null;

    this.planApi.getActivePlans().subscribe({
      next: (plans) => {
        this.plans = plans.sort((a, b) => a.displayOrder - b.displayOrder);
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  selectPlan(plan: SubscriptionPlanListItemDto): void {
    if (!this.businessId) return;
    this.router.navigate(['/activate-subscription'], {
      queryParams: { businessId: this.businessId, planId: plan.id },
    });
  }

  retry(): void {
    this.hasError = false;
    this.isLoading = true;
    this.ngOnInit();
  }

  readonly skeletons = [1, 2, 3];
}
