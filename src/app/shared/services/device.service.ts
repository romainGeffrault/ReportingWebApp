import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, Subject, fromEvent, takeUntil } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    private readonly MOBILE_WIDTH = 768;

    public readonly isMobile$ = new BehaviorSubject<boolean>(window.innerWidth <= this.MOBILE_WIDTH);

    private readonly ngZone = inject(NgZone);

    private destroy$ = new Subject<void>();

    constructor() {
        this.ngZone.runOutsideAngular(() => {
            fromEvent(window, 'resize')
                .pipe(takeUntil(this.destroy$))
                .subscribe((e) => {
                    const isMobileWindow = window.innerWidth <= this.MOBILE_WIDTH;
                    if (isMobileWindow && !this.isMobile$.value || !isMobileWindow && this.isMobile$.value) {
                        this.ngZone.run(() => {
                            this.isMobile$.next(isMobileWindow);
                        });
                    }
                })
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}