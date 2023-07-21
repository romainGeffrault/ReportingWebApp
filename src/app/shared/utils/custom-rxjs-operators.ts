import { ChangeDetectorRef } from "@angular/core";
import { Observable, catchError, ignoreElements, of, startWith, tap } from "rxjs";

export function markForCheck(changeDetectionRef: ChangeDetectorRef) {
    return function<T>(source: Observable<T>): Observable<T> {
      return source.pipe(
        tap(() => changeDetectionRef.markForCheck())
      );
    }
  };

export function getErrorMessage() {
    return function<T>(source: Observable<T>) {
        return source.pipe(
            ignoreElements(),
            startWith(null),
            catchError(error => {
              console.error('error', error);
              return of(error.message as string)
            }))
            ;
        }
}