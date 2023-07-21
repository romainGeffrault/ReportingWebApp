import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { JoinPipe } from 'src/app/shared/pipes/join.pipe';
import { Observation } from 'src/app/shared/types/observation.model';
import { Reporting } from 'src/app/shared/types/reporting.model';

@Component({
    selector: 'app-table-report',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        JoinPipe,
        MatTableModule,
        MatIconModule,
        MatListModule,
        MatButtonModule
    ],
    template: `
    <table mat-table [dataSource]="reportingList" [trackBy]="trackingRow" class="mat-elevation-z8" multiTemplateDataRows #matTable="matTable">
        <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>Id</th>
            <td mat-cell *matCellDef="let element">{{element.id}}</td>
        </ng-container>

        <ng-container matColumnDef="author">
            <th mat-header-cell *matHeaderCellDef>Author</th>
            <td mat-cell *matCellDef="let element">{{element.author.last_name}} {{element.author.first_name}}</td>
        </ng-container>

        <ng-container matColumnDef="observations">
            <th mat-header-cell *matHeaderCellDef>Observations</th>
            <td mat-cell *matCellDef="let element">{{ element.observations | appJoin : getObservationName : ', ' }}</td>
        </ng-container>

        <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let element">{{ element.description }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let element; dataIndex as index;" class="actionsCell">
            <ng-template [ngTemplateOutlet]="actionsTpl" [ngTemplateOutletContext]="{$implicit:element}"/>
            </td>
        </ng-container>


        <ng-container matColumnDef="details">
            <td mat-cell *matCellDef="let element" [attr.colspan]="overviewColumns.length">
                <mat-list>
                    <mat-list-item *ngFor="let observation of element.observations">
                      <mat-list-item role="listitem">{{ observation.name }}</mat-list-item>
                    </mat-list-item>
                </mat-list>
            </td>
        </ng-container>

        <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="overviewColumns.length">
              No data found.
            </td>
        </tr>

        <tr mat-header-row *matHeaderRowDef="overviewColumns; sticky:'true'"></tr>
        <tr mat-row *matRowDef="let row; columns: overviewColumns;"></tr>
    </table>`
})

export class TableReportComponent {

  @Input({ required: true }) reportingList!: Reporting[];

  @ContentChild('actionsTpl', { read: TemplateRef }) actionsTpl!:TemplateRef<any>;

  overviewColumns = ['id', 'author', 'observations', 'description', 'actions'];
  detailsColumns = ['details'];

  trackingRow(index: number, report: Reporting) {
    return report.id;
  }

  getObservationName = (observation: Observation) => {
    return observation.name;
  }
}