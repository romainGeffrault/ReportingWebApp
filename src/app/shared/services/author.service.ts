import { Injectable, inject } from '@angular/core';
import { map, of } from 'rxjs';
import { ReportingApiService } from './api/reporting/reporting-api.service';

@Injectable({providedIn: 'root'})
export class AuthorService {


    reportService = inject(ReportingApiService);

    store = sessionStorage;

    isMailAlreadyUsed(email: string) {
         return this.getAuthorList().pipe(
            map((authorList) => authorList.some((author) => author.email === email))
        );
    }

    private getAuthorList() {
        return this.reportService.getAll().pipe(
            map((reportingList) => reportingList.map((report) => report.author)),
        );
    }

}