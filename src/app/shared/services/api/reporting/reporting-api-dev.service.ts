import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { Reporting, EditedReport } from 'src/app/shared/types/reporting.model';
import { ReportingApiService } from './reporting-api.service';
import { HttpClient } from '@angular/common/http';
import { Observation } from 'src/app/shared/types/observation.model';
import { ObservationApiService } from '../observation/observation-api.service';

@Injectable()
export class ReportingApiDevService implements ReportingApiService {

    http = inject(HttpClient);
    observationService = inject(ObservationApiService);

    getAll() {
        return this.http.get<Reporting[]>('http://localhost:3000/reporting');
    }

    get(id: number) {
        return this.http.get<Reporting[]>(`http://localhost:3000/reporting?id=${id}`).pipe(map((reporting) => {
            if (!reporting.length) {
                throw new Error('Report not found.');
            }
            return reporting[0];
        }));
    }

    post(reporting: EditedReport): Observable<void> {
        return this.observationService.getAll().pipe(
            map((observationList) => this.editedReportToReporting(reporting, observationList)),
            switchMap((report) => this.http.post<Reporting>('http://localhost:3000/reporting', report)),
            map(() => {return;})
        );
    }

    put(reporting: EditedReport): Observable<void> {
        return this.observationService.getAll().pipe(
            map((observationList) => this.editedReportToReporting(reporting, observationList)),
            switchMap((report) => this.getAll().pipe(
                map((reportingList) => {
                    const reportIndex = reportingList.findIndex((report) => report.id === reporting.id) + 1;
                    return {reportIndex, report}
                })
            )),
            switchMap(({reportIndex, report}) => this.http.put<Reporting>(`http://localhost:3000/reporting/${reportIndex}`, report)),
            map(() => {return;})
        );
    }

    private editedReportToReporting(reporting: EditedReport, observationList: Observation[]): Reporting {
        return {
            ...reporting,
            observations: reporting.observations.map((observationId) => observationList.find((observation) => observation.id === observationId)) as Observation[]
        }
    }
}