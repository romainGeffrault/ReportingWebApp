import {MatCardModule} from '@angular/material/card';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Reporting } from 'src/app/shared/types/reporting.model';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-card-report',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatCardModule,
        MatDividerModule,
        MatButtonModule,
        RouterModule
    ],
    template: `
    <mat-card>
        <mat-card-header>
            <mat-card-subtitle>{{ report.author.first_name + ' ' + report.author.last_name }}</mat-card-subtitle>
            <mat-card-title>{{ report.description }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
            <p *ngFor="let observation of report.observations; trackBy: trackingObservation">{{observation.name}}</p>
            <mat-divider></mat-divider>
        </mat-card-content>
        <mat-card-actions align="end">
            <button mat-button [routerLink]="['/edit', report.id]" color="accent">Edit</button>
        </mat-card-actions>
    </mat-card>
    `
})

export class CardReportComponent{
    @Input({ required: true }) report!: Reporting;

    trackingObservation(index: number) {
        return index;
    }
}