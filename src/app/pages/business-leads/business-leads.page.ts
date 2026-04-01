import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, callOutline, logoWhatsapp, peopleOutline } from 'ionicons/icons';
import { ContactRequestListItem } from '../../features/contact-requests/models/contact-request.model';
import { ContactRequestsApiService } from '../../features/contact-requests/services/contact-requests-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-business-leads',
  standalone: true,
  imports: [IonContent, IonIcon, IonSkeletonText, DatePipe, AppHeaderComponent],
  templateUrl: './business-leads.page.html',
  styleUrls: ['./business-leads.page.scss'],
})
export class BusinessLeadsPage implements OnInit {
  businessId = 0;
  leads: ContactRequestListItem[] = [];
  isLoading = true;
  hasError = false;

  readonly skeletons = [1, 2, 3];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contactRequestsApi: ContactRequestsApiService,
  ) {
    addIcons({ mailOutline, callOutline, logoWhatsapp, peopleOutline });
  }

  ngOnInit(): void {
    this.businessId = Number(this.route.snapshot.paramMap.get('businessId'));
    this.contactRequestsApi.getByBusiness(this.businessId).subscribe({
      next: (items) => { this.leads = items; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  contactTypeIcon(type: string): string {
    switch (type) {
      case 'Call': return 'call-outline';
      case 'WhatsApp': return 'logo-whatsapp';
      case 'Message': return 'mail-outline';
      default: return 'mail-outline';
    }
  }
}
