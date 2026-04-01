import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeCircleOutline, cardOutline } from 'ionicons/icons';
import { PaymentApiService } from '../../features/payment/services/payment-api.service';
import { SubscriptionPlanListItemDto } from '../../features/subscription/models/subscription.model';
import { SubscriptionPlanApiService } from '../../features/subscription/services/subscription-plan-api.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-activate-subscription',
  standalone: true,
  imports: [IonContent, IonIcon, IonSkeletonText, NgIf, AppHeaderComponent, AppButtonComponent],
  templateUrl: './activate-subscription.page.html',
  styleUrls: ['./activate-subscription.page.scss'],
})
export class ActivateSubscriptionPage implements OnInit {
  plan: SubscriptionPlanListItemDto | null = null;
  businessId: number | null = null;
  isLoading = true;
  hasError = false;
  isPaying = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly planApi: SubscriptionPlanApiService,
    private readonly paymentApi: PaymentApiService
  ) {
    addIcons({ checkmarkOutline, closeCircleOutline, cardOutline });
  }

  ngOnInit(): void {
    const planId = Number(this.route.snapshot.queryParamMap.get('planId'));
    this.businessId = Number(this.route.snapshot.queryParamMap.get('businessId')) || null;

    if (!planId || !this.businessId) {
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    this.planApi.getPlanById(planId).subscribe({
      next: (plan) => {
        this.plan = plan;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  proceedToPayment(): void {
    if (!this.plan || !this.businessId || this.isPaying) return;

    this.isPaying = true;
    const callbackUrl = `${window.location.origin}/payment-callback`;

    this.paymentApi.createPayment({
      businessId: this.businessId,
      subscriptionPlanId: this.plan.id,
      autoRenew: false,
      callbackUrl,
    }).subscribe({
      next: (result) => {
        window.location.href = result.paymentUrl;
      },
      error: () => {
        this.isPaying = false;
      },
    });
  }
}
