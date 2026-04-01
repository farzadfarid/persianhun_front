import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { PaymentApiService } from '../../features/payment/services/payment-api.service';
import { PaymentResultDto } from '../../features/payment/models/payment.model';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [IonContent, IonIcon, NgIf, AppHeaderComponent, AppButtonComponent],
  templateUrl: './payment-callback.page.html',
  styleUrls: ['./payment-callback.page.scss'],
})
export class PaymentCallbackPage implements OnInit {
  result: PaymentResultDto | null = null;
  isLoading = true;
  hasError = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly paymentApi: PaymentApiService
  ) {
    addIcons({ checkmarkCircleOutline, closeCircleOutline });
  }

  ngOnInit(): void {
    const authority = this.route.snapshot.queryParamMap.get('authority') ?? '';
    const status = this.route.snapshot.queryParamMap.get('status') ?? '';

    if (!authority) {
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    this.paymentApi.handleCallback(authority, status).subscribe({
      next: (res) => {
        this.result = res;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  goToMyBusinesses(): void {
    this.router.navigate(['/my-businesses']);
  }

  tryAgain(): void {
    this.router.navigate(['/plans']);
  }
}
