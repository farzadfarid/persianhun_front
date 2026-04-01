import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, closeCircle, imageOutline } from 'ionicons/icons';
import { FileUploadService } from '../../../core/services/file-upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [IonIcon, IonSpinner],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnChanges {
  /** Stored filename (e.g. "abc123.jpg") — NOT a full URL */
  @Input() value: string | null = null;
  @Input() label = 'Image';
  @Input() shape: 'square' | 'circle' = 'square';
  @Output() valueChange = new EventEmitter<string | null>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploading = false;
  error: string | null = null;
  /** Resolved full URL for display only */
  previewUrl: string | null = null;

  constructor(private readonly fileUpload: FileUploadService) {
    addIcons({ cameraOutline, imageOutline, closeCircle });
  }

  ngOnChanges(): void {
    this.previewUrl = this.fileUpload.getUrl(this.value);
  }

  openPicker(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.error = null;
    this.uploading = true;

    this.fileUpload.uploadImage(file).subscribe({
      next: (fileName) => {
        this.value = fileName;
        this.previewUrl = this.fileUpload.getUrl(fileName);
        this.valueChange.emit(fileName);
        this.uploading = false;
      },
      error: () => {
        this.error = 'Upload failed. Try again.';
        this.uploading = false;
      },
    });

    input.value = '';
  }

  clear(): void {
    this.value = null;
    this.previewUrl = null;
    this.valueChange.emit(null);
  }
}
