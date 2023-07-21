import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPTY, Observable, combineLatest } from 'rxjs';
import { catchError, map, shareReplay, startWith } from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CardReportComponent } from './shared/card-report.component';
import { TableReportComponent } from './shared/table-report.component';
import { IsMobileDirective } from 'src/app/shared/directives/is-mobile.directive';
import { IsNotMobileDirective } from 'src/app/shared/directives/is-not-mobile';
import { DeviceService } from 'src/app/shared/services/device.service';
import { Reporting } from 'src/app/shared/types/reporting.model';
import { getErrorMessage } from 'src/app/shared/utils/custom-rxjs-operators';
import { ReportingApiService } from 'src/app/shared/services/api/reporting/reporting-api.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
    CardReportComponent,
    TableReportComponent,
    IsMobileDirective,
    IsNotMobileDirective
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DeviceService]
})
export class ListComponent {

  listService = inject(ReportingApiService);

  reportingList$ = this.listService.getAll().pipe(
    startWith(null),
    shareReplay(1)
  );

  reportingListError$ = this.reportingList$.pipe(
    getErrorMessage()
  );

  vm$: Observable<{
    reportingList: Reporting[];
    isLoading: boolean;
    reportingListError: any;
  }> = combineLatest({
    reportingList: this.reportingList$.pipe(catchError(() => EMPTY)),
    reportingListError: this.reportingList$.pipe(getErrorMessage())
  }).pipe(
    map(({reportingList, reportingListError}) => {
      const reportList: Reporting[] = reportingList || [];

      return{
        reportingList: [...reportList], // Create a new list ref in order to rerender the table each time
        isLoading: reportingList === null,
        reportingListError
      }
    })
  );

  trackingRow(index: number, report: Reporting) {
    return report.id;
  }
}
