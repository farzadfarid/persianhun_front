import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { trashOutline, starOutline, star } from 'ionicons/icons';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppInputComponent } from '../../shared/components/app-input/app-input.component';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { BusinessDetails, BusinessImageDto } from '../../features/business/models/business.model';
import { FileUploadService } from '../../core/services/file-upload.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-edit-business',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonSpinner,
    IonIcon,
    AppHeaderComponent,
    AppButtonComponent,
    AppInputComponent,
    ImageUploadComponent,
    UploadUrlPipe,
    TranslateModule,
  ],
  templateUrl: './edit-business.page.html',
  styleUrls: ['./edit-business.page.scss'],
})
export class EditBusinessPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly businessApi = inject(BusinessApiService);
  private readonly fileUpload = inject(FileUploadService);
  private readonly toast = inject(ToastService);

  constructor() {
    addIcons({ trashOutline, starOutline, star });
  }

  loading = true;
  saving = false;
  business: BusinessDetails | null = null;
  logoUrl: string | null = null;
  galleryImages: BusinessImageDto[] = [];
  galleryUploading = false;

  form = this.fb.nonNullable.group({
    name:           ['', Validators.required],
    nameFa:         [''],
    description:    [''],
    descriptionFa:  [''],
    phoneNumber:    [''],
    email:          [''],
    website:        [''],
    instagramUrl:   [''],
    telegramUrl:    [''],
    whatsAppNumber: [''],
    addressLine:    [''],
    addressLineFa:  [''],
    city:           [''],
    cityFa:         [''],
    region:         [''],
    regionFa:       [''],
    postalCode:     [''],
    country:        ['Sweden'],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.businessApi.getById(id).subscribe({
      next: (biz) => {
        this.business = biz;
        this.logoUrl = biz.logoUrl;
        this.galleryImages = biz.images ?? [];
        this.form.patchValue({
          name:           biz.name ?? '',
          nameFa:         biz.nameFa ?? '',
          description:    biz.description ?? '',
          descriptionFa:  biz.descriptionFa ?? '',
          phoneNumber:    biz.phoneNumber ?? '',
          email:          biz.email ?? '',
          website:        biz.website ?? '',
          instagramUrl:   biz.instagramUrl ?? '',
          telegramUrl:    biz.telegramUrl ?? '',
          whatsAppNumber: biz.whatsAppNumber ?? '',
          addressLine:    biz.addressLine ?? '',
          addressLineFa:  biz.addressLineFa ?? '',
          city:           biz.city ?? '',
          cityFa:         biz.cityFa ?? '',
          region:         biz.region ?? '',
          regionFa:       biz.regionFa ?? '',
          postalCode:     biz.postalCode ?? '',
          country:        biz.country ?? 'Sweden',
        });
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  submit(): void {
    if (this.form.invalid || !this.business) return;
    this.saving = true;
    const v = this.form.getRawValue();

    this.businessApi.update(this.business.id, {
      name:           v.name,
      nameFa:         v.nameFa || null,
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
        this.toast.success('Business updated successfully!');
        this.router.navigate(['/my-businesses']);
      },
      error: () => { this.saving = false; },
    });
  }

  onGalleryFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.business) return;

    this.galleryUploading = true;
    this.fileUpload.uploadImage(file).subscribe({
      next: (url) => {
        this.businessApi.addImage(this.business!.id, url, null, this.galleryImages.length === 0).subscribe({
          next: (img) => {
            this.galleryImages = [...this.galleryImages, img];
            this.galleryUploading = false;
          },
          error: () => { this.galleryUploading = false; },
        });
      },
      error: () => { this.galleryUploading = false; },
    });

    input.value = '';
  }

  removeGalleryImage(img: BusinessImageDto): void {
    if (!this.business) return;
    this.businessApi.removeImage(this.business.id, img.id).subscribe({
      next: () => {
        this.galleryImages = this.galleryImages.filter((i) => i.id !== img.id);
      },
    });
  }

  setCover(img: BusinessImageDto): void {
    if (!this.business) return;
    this.businessApi.setCoverImage(this.business.id, img.id).subscribe({
      next: () => {
        this.galleryImages = this.galleryImages.map((i) => ({ ...i, isCover: i.id === img.id }));
        this.toast.success('Cover image updated.');
      },
    });
  }
}
