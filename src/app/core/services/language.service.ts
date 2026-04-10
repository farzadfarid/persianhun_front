import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'fa';

const STORAGE_KEY = 'ph_lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  get current(): AppLanguage {
    return this.translate.currentLang as AppLanguage ?? 'en';
  }

  get isRtl(): boolean {
    return this.current === 'fa';
  }

  init(): void {
    const saved = localStorage.getItem(STORAGE_KEY) as AppLanguage | null;
    const lang: AppLanguage = saved === 'fa' ? 'fa' : 'en';
    this.translate.addLangs(['en', 'fa']);
    this.translate.setDefaultLang('en');
    this.translate.use(lang);
    this.applyToDocument(lang);
  }

  toggle(): void {
    const next: AppLanguage = this.current === 'en' ? 'fa' : 'en';
    this.set(next);
  }

  set(lang: AppLanguage): void {
    localStorage.setItem(STORAGE_KEY, lang);
    this.translate.use(lang);
    this.applyToDocument(lang);
  }

  /** Returns the localised value: fa field when Persian is active, fallback to en. */
  pick(en: string | null | undefined, fa: string | null | undefined): string {
    if (this.current === 'fa' && fa) return fa;
    return en ?? '';
  }

  private applyToDocument(lang: AppLanguage): void {
    const html = document.documentElement;
    if (lang === 'fa') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'fa');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
    }
  }
}
