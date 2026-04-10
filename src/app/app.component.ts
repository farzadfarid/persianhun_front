import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AppToastComponent } from './shared/components/app-toast/app-toast.component';
import { LanguageService } from './core/services/language.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, AppToastComponent],
})
export class AppComponent {
  constructor() {
    inject(LanguageService).init();
    SplashScreen.hide();
  }
}
