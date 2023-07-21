import { Directive, inject } from '@angular/core';
import { IsMobileDirective } from './is-mobile.directive';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
    selector: '[isNotMobile]',
    standalone: true,
    hostDirectives: [IsMobileDirective]
})
export class IsNotMobileDirective {
    isMobileDirective = inject(IsMobileDirective, { self: true });

    constructor() {
        this.isMobileDirective.isMobile$.pipe(
                takeUntilDestroyed(),
                map((isMobile) => !isMobile)
            ).subscribe((isNotMobile) => {
                this.isMobileDirective.display(isNotMobile);
            });
    }
}