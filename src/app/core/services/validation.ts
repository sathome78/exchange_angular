import {Injectable} from '@angular/core';
import {FormControl, FormGroup, AbstractControl} from '@angular/forms';

const VALIDATION_MESSAGES = {
  email: {
    required: 'Username is required'
  },
  password: {
    match: 'Passwords do not match'
  },
  passwordRepeat: {
    match: 'Passwords do not match'
  }
};

@Injectable()
export class ValidationService {

  /**
   * Holds form error messages mapped to field names
   */
  formErrors = {
    email: '',
    password: '',
    passwordRepeat: ''
  };

  /**
   * Takes field error and error details and returns validation message
   * @param field
   * @param error
   * @param details
   */
  getMessage = (field, error, details) => {
    if (!VALIDATION_MESSAGES[field]) {
      console.error(`Validation message is not defined for: ${field}`);
    }

    const msg = VALIDATION_MESSAGES[field][error];

    if (!msg) {
      return error;
    } else if (msg instanceof Function) {
      return msg(details);
    } else {
      return msg;
    }
  };

/*

  /!**
   * Validates if password and repeat password are the same
   * @TODO: Draft for equal validator
   *!/
  passwordMatch = () => (fc: FormControl) => {
    if (!fc) {
      return;
    }

    const passwordControl = fc['password'];
    const passwordRepeatControl = fc['passwordRepeat'];

    if (passwordControl.value != passwordRepeatControl.value) {
      passwordControl.setErrors({match: true});
      passwordRepeatControl.setErrors({match: true});

      passwordRepeatControl.markAsTouched({onlySelf: true});
      passwordControl.markAsTouched({onlySelf: true});

      return {match: true};

    } else {
      if (passwordControl.errors) {
        passwordControl.setErrors(null);
      }
      if (passwordRepeatControl.errors) {
        passwordRepeatControl.setErrors(null);
      }
    }

    return null;
  };
*/

  matchPassword = (control: AbstractControl): {[key: string]: boolean} => {
    const password = control.get('password');
    const passwordRepeat = control.get('passwordRepeat');

    if (!password || !passwordRepeat) return null;
    return password.value == passwordRepeat.value ? null : {nomatch: true};
  };

  /**
   * Handles when form value is changed
   */
  onValueChange = (form: FormGroup) => {
    Object.keys(this.formErrors).forEach(field => {
      const control = form.controls[field];
      // return if we dont have such control or user did not touch it yet
      if (!control || !control.touched) {
        return;
      }

      const errors = control.errors;

      this.formErrors[field] = '';

      if (!errors) {
        return;
      }

      Object.keys(errors).forEach(error => {
        this.formErrors[field] += this.getMessage(field, error, errors[error]) + ' ';
      });
    });

    return this.formErrors;
  }

}
