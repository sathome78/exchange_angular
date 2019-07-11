import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'app/core/reducers';
import { first } from 'rxjs/operators';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  constructor(
    private userService: UserService,
    private store: Store<State>,) {
    
    this.initForm();
  }

  form: FormGroup;
  check: boolean = false;
  isVerify: any;
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();
  @Input() public email: string;

  ngOnInit() {

    // this.checkUserInfo();

    this.checkEmail(this.email);
  }

  checkEmail(email: string){
    this.userService.getCheckTo2FAEnabled(email).pipe(first()).subscribe(data => {
      console.log(data)
    })
  }


  initForm() {
    this.form = new FormGroup({
      country: new FormControl('', {validators: [
          Validators.required,
        ]
      }),
      firstName: new FormControl('', {validators: [
          Validators.required
        ]
      }),
      lastName: new FormControl('', {validators: [
          Validators.required
        ]
      }),
      birthDay: new FormControl('', {validators: [
          Validators.required
        ]
      }),
      phone: new FormControl('', {validators: [
          Validators.required
        ]
      }),
      theCheckbox: new FormControl('', {validators: [
          Validators.required
        ]
      })
    });
    this.form.controls.theCheckbox.setValue(false);
  }

  get currentCountry(): any {
    return this.form.get('country');
  }
  get currentFirstName(): any {
    return this.form.get('firstName');
  }
  get currentLastName(): any {
    return this.form.get('lastName');
  }
  get currentBirthDay(): any {
    return this.form.get('birthDay');
  }
  get currentPhoneCode(): any {
    return this.form.get('phone');
  }

  gotToStepTwo(form: any) {
      console.log(form);
      this.nextStep.emit(2);
  }

  checked(e) {
    this.check = e.target.checked;
    this.form.controls.theCheckbox.setValue(e.target.checked);
  }




  // old method for check mail don't delete
  // checkUserInfo() {
  //   this.store
  //     .pipe(first(),
  //           select(getUserInfo),
  //           switchMap(user => this.mail = user.username))
  //     .pipe(first(),
  //           switchMap(data => {return this.userService.getUserGoogleLoginEnabled(this.mail)}))
  //     .subscribe(user => {
  //       console.log(user);
  //     });
  // }
}
