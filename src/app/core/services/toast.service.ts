import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  readonly toasts = signal<Toast[]>([]);

  success(message: string, title?: string): void {
    this.add({ message, type: 'success', title });
  }

  error(message: string, title?: string): void {
    this.add({ message, type: 'error', title });
  }

  info(message: string, title?: string): void {
    this.add({ message, type: 'info', title });
  }

  warning(message: string, title?: string): void {
    this.add({ message, type: 'warning', title });
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private add(toast: Omit<Toast, 'id'>): void {
    const id = ++this.counter;
    this.toasts.update((list) => [...list, { ...toast, id }]);
    setTimeout(() => this.dismiss(id), 3500);
  }
}
