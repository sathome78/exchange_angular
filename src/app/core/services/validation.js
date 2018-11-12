var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
var VALIDATION_MESSAGES = {
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
var ValidationService = /** @class */ (function () {
    function ValidationService() {
        var _this = this;
        /**
         * Holds form error messages mapped to field names
         */
        this.formErrors = {
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
        this.getMessage = function (field, error, details) {
            if (!VALIDATION_MESSAGES[field]) {
                console.error("Validation message is not defined for: " + field);
            }
            var msg = VALIDATION_MESSAGES[field][error];
            if (!msg) {
                return error;
            }
            else if (msg instanceof Function) {
                return msg(details);
            }
            else {
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
        this.matchPassword = function (control) {
            var password = control.get('password');
            var passwordRepeat = control.get('passwordRepeat');
            if (!password || !passwordRepeat)
                return null;
            return password.value == passwordRepeat.value ? null : { nomatch: true };
        };
        /**
         * Handles when form value is changed
         */
        this.onValueChange = function (form) {
            Object.keys(_this.formErrors).forEach(function (field) {
                var control = form.controls[field];
                // return if we dont have such control or user did not touch it yet
                if (!control || !control.touched) {
                    return;
                }
                var errors = control.errors;
                _this.formErrors[field] = '';
                if (!errors) {
                    return;
                }
                Object.keys(errors).forEach(function (error) {
                    _this.formErrors[field] += _this.getMessage(field, error, errors[error]) + ' ';
                });
            });
            return _this.formErrors;
        };
    }
    ValidationService = __decorate([
        Injectable()
    ], ValidationService);
    return ValidationService;
}());
export { ValidationService };
