import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, searchOutline } from 'ionicons/icons';
import { BusinessCardComponent } from '../../features/business/components/business-card/business-card.component';
import { BusinessSearchItem } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonContent, IonIcon, RouterLink, AppHeaderComponent, BusinessCardComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  featuredBusinesses: BusinessSearchItem[] = [];
  isFeaturedLoading = true;

  constructor(private readonly businessApi: BusinessApiService) {
    addIcons({ arrowForwardOutline, searchOutline });
  }

  ngOnInit(): void {
    this.businessApi.searchBusinesses({ page: 1, pageSize: 4 }).subscribe({
      next: (result) => {
        this.featuredBusinesses = result.items;
        this.isFeaturedLoading = false;
      },
      error: () => {
        this.isFeaturedLoading = false;
      },
    });
  }
}
