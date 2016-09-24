import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static range(min: number, max: number):ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const val = control.value;
      return (val < min || val > max) ? { 'Not in range': {val}} : null
    };
  }
}
