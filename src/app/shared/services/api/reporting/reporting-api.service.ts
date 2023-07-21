import { Injectable, isDevMode } from '@angular/core';
import { ReportingApiWebBrowserService } from './reporting-api-web-browser.service';
import { Observable } from 'rxjs';
import { Reporting, EditedReport } from 'src/app/shared/types/reporting.model';
import { ReportingApiDevService } from './reporting-api-dev.service';

@Injectable({
    providedIn: 'root',
    useFactory: () => isDevMode() ? new ReportingApiDevService() : new ReportingApiWebBrowserService()
})
export abstract class ReportingApiService {
    abstract getAll(): Observable<Reporting[]>;
    abstract get(id: number): Observable<Reporting>;
    abstract post(reporting: EditedReport): Observable<void>;
    abstract put(reporting: EditedReport): Observable<void>;
}