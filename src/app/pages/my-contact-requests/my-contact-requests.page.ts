import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { IonContent, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import { mailOutline, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';

import { forkJoin, of } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { BusinessApiService } from '../../features/business/services/business-api.service';

import { ContactRequestListItem } from '../../features/contact-requests/models/contact-request.model';

import { ContactRequestsApiService } from '../../features/contact-requests/services/contact-requests-api.service';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

interface ContactRow extends ContactRequestListItem {
  businessName: string;
  expanded: boolean;
}

@Component({
  selector: 'app-my-contact-requests',
  standalone: true,
  imports: [TranslateModule, FormsModule, DatePipe, IonContent, IonIcon, AppHeaderComponent],
  templateUrl: './my-contact-requests.page.html',
  styleUrls: ['./my-contact-requests.page.scss'],
})
export class MyContactRequestsPage implements OnInit {
  requests: ContactRow[] = [];
  isLoading = true;
  hasError = false;

  selectedBusinessId: number | null = null;
  businesses: { id: number; name: string }[] = [];

  constructor(
    private readonly businessApi: BusinessApiService,
    private readonly contactRequestsApi: ContactRequestsApiService,
  ) {
    addIcons({ mailOutline, chevronDownOutline, chevronUpOutline });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.hasError = false;
    this.businessApi.getMyBusinesses().subscribe({
      next: (businesses) => {
        this.businesses = businesses.map(b => ({ id: b.id, name: b.name }));
        if (!businesses.length) { this.requests = []; this.isLoading = false; return; }
        const requests = businesses.map(b =>
          this.contactRequestsApi.getByBusiness(b.id).pipe(catchError(() => of([] as ContactRequestListItem[])))
        );
        forkJoin(requests).subscribe({
          next: (results) => {
            this.requests = results.flatMap((items, i) =>
              items.map(r => ({ ...r, businessName: businesses[i].name, expanded: false }))
            ).sort((a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime());
            this.isLoading = false;
          },
          error: () => { this.hasError = true; this.isLoading = false; },
        });
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  get filtered(): ContactRow[] {
    if (!this.selectedBusinessId) return this.requests;
    return this.requests.filter(r => r.businessId === this.selectedBusinessId);
  }

  toggle(req: ContactRow): void { req.expanded = !req.expanded; }

  contactTypeLabel(type: string): string {
    const map: Record<string, string> = {
      Call: 'Call', Message: 'Message', WhatsApp: 'WhatsApp',
      FormSubmit: 'Form', ClickToContact: 'Click',
    };
    return map[type] ?? type;
  }
}
