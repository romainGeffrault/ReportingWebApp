import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, map, of, shareReplay, startWith, switchMap, take } from 'rxjs';
import { Reporting } from '../../shared/types/reporting.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomValidators } from '../../shared/form/custom-validators';
import {MatRadioModule} from '@angular/material/radio';
import { AuthorService } from '../../shared/services/author.service';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { getErrorMessage, markForCheck } from '../../shared/utils/custom-rxjs-operators';
import { Router, RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BackButtonComponent } from '../../shared/components/back-button.component';
import { ReportingApiService } from 'src/app/shared/services/api/reporting/reporting-api.service';
import { ObservationApiService } from 'src/app/shared/services/api/observation/observation-api.service';

type ReportForm = FormGroup<{ id: FormControl<number | null>; author: FormGroup<{ first_name: FormControl<string>; last_name: FormControl<string>; birth_date: FormControl<(string | (((control: AbstractControl<any, any>) => ValidationErrors | null) | ((control: FormControl<any>) => { minDate: string; } | null))[])[]>; sex: FormControl<"Men" | "Woman" | "Non-binary">; email: FormControl<string | ((email: FormControl<string>) => Observable<{ isMailAlreadyUsed: boolean; } | null>)>; }>; description: FormControl<string>; observations: FormControl<number[]>; }>;

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
    BackButtonComponent
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent {

  @Input() set id(id: string) {
    this.id$.next(id ? parseInt(id): undefined);
  }

  private id$ = new BehaviorSubject<number | undefined>(undefined);

  private formBuilder = inject(FormBuilder);
  private reportService = inject(ReportingApiService)
  private authorService = inject(AuthorService);
  private observationApiService = inject(ObservationApiService);
  private changeDetectionRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  private reportForm$: Observable<ReportForm> = this.id$.pipe(
      startWith(undefined),
      switchMap(id => id ? this.reportService.get(id) : of(this.emptyReport)),
      map((report) => {
        return this.formBuilder.nonNullable.group({
          id: report.id || null,
          author: this.formBuilder.nonNullable.group({
            first_name: [report.author.first_name, [Validators.required, Validators.maxLength(50)]],
            last_name: [report.author.last_name, [Validators.required, Validators.maxLength(50)]],
            birth_date: [report.author.birth_date, [Validators.required, CustomValidators.minDateValidator(this.date100YearsAgo)]],
            sex: [report.author.sex, [Validators.required]],
            email: [report.author.email, [Validators.required, Validators.email], this.isMailAlreadyUsed]
          }),
          description: [report.description, [Validators.required]],
          observations: [report.observations.map(observation => observation.id), [Validators.required]]
        });
      }),
    )

    private get emptyReport(): Reporting {
    return {
      author: {
        first_name: '',
        last_name: '',
        email: '',
        birth_date: '',
        sex: 'Woman'
      },
      observations: [],
      description: ''
    };
  };

  private observationList$ = this.observationApiService.getAll().pipe(
    startWith(null),
    shareReplay(1),
    catchError(() => EMPTY)
  );

  private error$ = new BehaviorSubject<string | null>(null);

  private savingReport$ = new BehaviorSubject<boolean>(false);

  public readonly vm$ = combineLatest({
    reportForm: this.reportForm$.pipe(catchError(() => EMPTY)),
    reportFormError: this.reportForm$.pipe(getErrorMessage()),
    id: this.id$,
    observationList: this.observationList$,
    observationListError: this.observationList$.pipe(getErrorMessage()),
    error: this.error$,
    savingReport: this.savingReport$
  }).pipe(
    map(({reportForm, id, observationList, reportFormError, observationListError, error, savingReport}) => {
      return {
        reportForm,
        observationList,
        isLoading: (id || null) !== reportForm?.getRawValue().id || !observationList,
        hasError: reportFormError || observationListError || error,
        savingReport
      }
    })
  );

  currentDate = new Date();
  date100YearsAgo = new Date(this.currentDate.getFullYear() - 100, this.currentDate.getMonth(), this.currentDate.getDate());

  private isMailAlreadyUsed = (email: FormControl) => {
    if(!email.value) {
      return of(null).pipe(
        markForCheck(this.changeDetectionRef)
      );
    }
    if (email.defaultValue === email.value) {
      return of(null).pipe(
        markForCheck(this.changeDetectionRef)
      );
    }

    return this.authorService.isMailAlreadyUsed(email.value).pipe(
      map(isMailAlreadyUsed => isMailAlreadyUsed ? {isMailAlreadyUsed: true} : null),
      markForCheck(this.changeDetectionRef)
    );
  }

  public onSubmit(form: ReportForm, savingReport: boolean) {
    if (form.invalid) {
      return;
    }

    if (savingReport) {
      return;
    }

    this.savingReport$.next(true);
    form.disable();

    // @ts-ignore
    const request = form.getRawValue().id ? this.reportService.put(form.getRawValue()) : this.reportService.post(form.getRawValue());
    request.subscribe({
      next: () => {
        form.markAsPristine();
        this.router.navigate(['/list']);
        this.savingReport$.next(false);
        form.enable();
      },
      error: (error) => {
        this.error$.next(error.message);
        this.savingReport$.next(false);
        form.enable();
      }
    });
  }

  public canDeactivate() {
    return this.vm$.pipe(
      take(1),
      map(vm => vm.reportForm.pristine)
    );
  }
}
