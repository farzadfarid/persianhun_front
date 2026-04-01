import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

interface UploadResult {
  fileName: string;
  fileType: string;
}

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private readonly http = inject(HttpClient);

  /** Upload an image file. Returns just the filename (e.g. "abc123.jpg") for storage in DB. */
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<UploadResult>(`${environment.apiUrl}/files/upload`, formData)
      .pipe(map((res) => res.fileName));
  }

  /**
   * Convert a stored filename to a displayable URL.
   * e.g. "abc123.jpg" → "http://localhost:5000/uploads/abc123.jpg"
   */
  getUrl(fileName: string | null | undefined): string | null {
    if (!fileName) return null;
    // Remove /api/v1 suffix from apiUrl to get base server URL
    const base = environment.apiUrl.replace(/\/api\/v\d+$/, '');
    return `${base}/uploads/${fileName}`;
  }
}
