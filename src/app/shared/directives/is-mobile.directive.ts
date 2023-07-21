import {
    ChangeDetectorRef,
    DestroyRef,
    Directive,
    TemplateRef,
    ViewContainerRef,
  } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Directive({
  selector: '[isMobile]',
  standalone: true,
})
export class IsMobileDirective {

  isMobile$ =  this.deviceService.isMobile$;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private vcr: ViewContainerRef,
    private deviceService: DeviceService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.isMobile$.pipe(takeUntilDestroyed()).subscribe(
      (isMobile) => {
        this.display(isMobile);
      });
  }

  display(show: boolean) {
    show ? this.vcr.createEmbeddedView(this.templateRef) : this.vcr.clear();
    this.changeDetectorRef.markForCheck();
  }
}