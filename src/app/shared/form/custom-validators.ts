import { FormControl } from "@angular/forms";

export class CustomValidators {

    static minDateValidator(minDate: Date) {
        return (control: FormControl) => {
          const selectedDate = control.value;

          if (selectedDate && selectedDate < minDate) {
            return {
              minDate: minDate.toISOString()
            };
          }

          return null;
        };
    }
}