import { CommonModule, Location } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-back-button',
    template: `
    <button mat-button color="primary">
        <mat-icon>keyboard_arrow_left</mat-icon>
        <ng-content/>
    </button>
    `,
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        RouterModule
    ],
})
export class BackButtonComponent {}