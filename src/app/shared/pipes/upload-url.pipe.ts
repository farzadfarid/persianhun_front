import { inject, Pipe, PipeTransform } from '@angular/core';
import { FileUploadService } from '../../core/services/file-upload.service';

/** Converts a stored filename to a full upload URL for display. */
@Pipe({ name: 'uploadUrl', standalone: true })
export class UploadUrlPipe implements PipeTransform {
  private readonly fileUpload = inject(FileUploadService);

  transform(fileName: string | null | undefined): string | null {
    return this.fileUpload.getUrl(fileName);
  }
}
