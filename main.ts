import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Hammer JS
import 'hammerjs';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
