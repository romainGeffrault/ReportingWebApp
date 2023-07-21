import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { Observation } from 'src/app/shared/types/observation.model';
import { ObservationApiWebBrowserService } from './observation-api-web-browser.service';
import { ObservationApiDevService } from './observation-api-dev.service';

@Injectable({
    providedIn: 'root',
    useFactory: () => isDevMode() ? new ObservationApiDevService() : new ObservationApiWebBrowserService()
})
export abstract class ObservationApiService {
    abstract getAll(): Observable<Observation[]>;
}