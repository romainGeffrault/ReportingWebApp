import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observation } from 'src/app/shared/types/observation.model';
import { ObservationApiService } from './observation-api.service';

@Injectable()
export class ObservationApiDevService implements ObservationApiService {

    http = inject(HttpClient);

    getAll() {
        return this.http.get<Observation[]>('http://localhost:3000/observation');
    }
}