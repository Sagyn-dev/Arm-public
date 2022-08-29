import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Calendar } from 'primeng/calendar';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// устанавливает формат календаря для primeNg компонента используется в фильтрации таблиц
Calendar.prototype.getDateFormat = () => 'dd/mm/yy';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
