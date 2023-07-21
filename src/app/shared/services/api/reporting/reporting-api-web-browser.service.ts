import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of, switchMap, tap } from 'rxjs';
import { Reporting, EditedReport } from 'src/app/shared/types/reporting.model';
import { ReportingApiService } from './reporting-api.service';
import { DEFAULT_REPORTING_LIST } from 'src/app/shared/mock/reporting-list';
import { Observation } from 'src/app/shared/types/observation.model';
import { ObservationApiService } from '../observation/observation-api.service';

@Injectable()
export class ReportingApiWebBrowserService implements ReportingApiService {
    REPORTING_LIST_KEY = 'ReportingList';

    store = sessionStorage;
    observationService = inject(ObservationApiService);

    getAll(): Observable<Reporting[]> {
        const reportingStored = this.store.getItem(this.REPORTING_LIST_KEY);
        return of(reportingStored ? JSON.parse(reportingStored) : DEFAULT_REPORTING_LIST).pipe(
            delay(1500)
        );
    }

    get(id: number) {
        return this.getAll().pipe(
            map((reportingList) => reportingList.find(report => report.id === id)),
            map((report) => {
                if (!report) {
                    throw new Error('Report not found.');
                }
                return report;
            })
        );
    }

    post(reporting: EditedReport) {
        return this.getAll().pipe(
            switchMap((reportingList) => this.observationService.getAll().pipe(
                map((observationList) => ({reportingList, observationList}))
                )),
            tap(({reportingList, observationList}) => {
                const report = this.editedReportToReporting(reporting, observationList);
                const id = this.getUniqueId(reportingList);
                report.id = id;
                reportingList.push(report);
                this.save(reportingList);
            }),
            map(() => {return})
        )
    }

    put(reporting: EditedReport) {
        return this.getAll().pipe(
            switchMap((reportingList) => this.observationService.getAll().pipe(
                map((observationList) => ({reportingList, observationList}))
                )),
            tap(({reportingList, observationList}) => {
                const reportIndex = reportingList.findIndex((report) => report.id === reporting.id)
                if (reportIndex === -1) {
                    throw new Error('Report not found.');
                }
                const report = this.editedReportToReporting(reporting, observationList);
                reportingList[reportIndex] = report;
                this.save(reportingList);
            }),
            map(() => {return})
        )
    }

    private editedReportToReporting(reporting: EditedReport, observationList: Observation[]): Reporting {
        return {
            ...reporting,
            observations: reporting.observations.map((observationId) => observationList.find((observation) => observation.id === observationId)) as Observation[]
        }
    }

    private save(reportingList: Reporting[]) {
        this.store.setItem(this.REPORTING_LIST_KEY, JSON.stringify(reportingList));
    }

    private getUniqueId(reportingList: Reporting[]) {
        return Math.max(...reportingList.map((report) => report.id || 0)) + 1;
    }

}