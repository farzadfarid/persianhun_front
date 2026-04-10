import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppInputComponent } from '../../shared/components/app-input/app-input.component';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-create-business',
  standalone: true,
  imports: [
    IonContent,
    ReactiveFormsModule,
    AppHeaderComponent,
    AppButtonComponent,
    AppInputComponent,
    ImageUploadComponent,
    TranslateModule,
  ],
  templateUrl: './create-business.page.html',
  styleUrls: ['./create-business.page.scss'],
})
export class CreateBusinessPage {
  private readonly fb = inject(FormBuilder);
  private readonly businessApi = inject(BusinessApiService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  logoUrl: string | null = null;
  saving = false;

  form = this.fb.nonNullable.group({
    name:           ['', Validators.required],
    nameFa:         [''],
    description:    [''],
    descriptionFa:  [''],
    phoneNumber:    [''],
    email:          [''],
    website:        [''],
    addressLine:    [''],
    addressLineFa:  [''],
    city:           [''],
    cityFa:         [''],
    region:         [''],
    regionFa:       [''],
    postalCode:     [''],
    country:        ['Sweden'],
    instagramUrl:   [''],
    telegramUrl:    [''],
    whatsAppNumber: [''],
  });

  submit(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    const v = this.form.getRawValue();

    this.businessApi.create({
      name:           v.name,
      nameFa:         v.nameFa || null,
      slug:           null,
      description:    v.description || null,
      descriptionFa:  v.descriptionFa || null,
      phoneNumber:    v.phoneNumber || null,
      email:          v.email || null,
      website:        v.website || null,
      instagramUrl:   v.instagramUrl || null,
      telegramUrl:    v.telegramUrl || null,
      whatsAppNumber: v.whatsAppNumber || null,
      addressLine:    v.addressLine || null,
      addressLineFa:  v.addressLineFa || null,
      city:           v.city || null,
      cityFa:         v.cityFa || null,
      region:         v.region || null,
      regionFa:       v.regionFa || null,
      postalCode:     v.postalCode || null,
      country:        v.country || 'Sweden',
      latitude:       null,
      longitude:      null,
      logoUrl:        this.logoUrl,
    }).subscribe({
      next: () => {
        this.toast.success('Business created successfully!');
        this.router.navigate(['/my-businesses']);
      },
      error: () => { this.saving = false; },
    });
  }
}
