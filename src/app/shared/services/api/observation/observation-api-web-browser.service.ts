import { Injectable } from '@angular/core';
import { Observation } from '../../../types/observation.model';
import { Observable, of, delay } from 'rxjs';
import { DEFAULT_OBSERVATION_LIST } from '../../../mock/observation-list';
import { ObservationApiService } from './observation-api.service';

@Injectable({providedIn: 'root'})
export class ObservationApiWebBrowserService implements ObservationApiService {
    OBSERVATION_LIST_KEY = 'ObservationList';

    store = sessionStorage;

    getAll(): Observable<Observation[]> {
        const observationsStored = this.store.getItem(this.OBSERVATION_LIST_KEY);
        return of(observationsStored ? JSON.parse(observationsStored) : DEFAULT_OBSERVATION_LIST).pipe(
            delay(1500)
        );
    }

}