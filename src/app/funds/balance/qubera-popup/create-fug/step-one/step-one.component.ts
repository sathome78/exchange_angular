import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'app/core/reducers';
import { first, takeUntil } from 'rxjs/operators';
import { UserService } from 'app/shared/services/user.service';
import { Subject } from 'rxjs';
import { KycCountry } from 'app/shared/interfaces/kyc-country-interface';
import { SettingsService } from 'app/settings/settings.service';
import { BalanceService } from 'app/funds/services/balance.service';
import { BankVerification } from 'app/model/bank-veryfication.model';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  constructor(
    private userService: UserService,
    private balanceService: BalanceService,
    private settingsService: SettingsService,
    private store: Store<State>,) {
    
    this.initForm();
  }

  form: FormGroup;
  check: boolean = false;
  isVerify: any;
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();
  @Input() public email: string;


  // country
  
  public openCountryDropdown: Boolean = false;
  public showCountryLabelFlag: Boolean = false;
  public selectedCountry;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public countryArray: KycCountry[] = [];
  public countryArrayDefault: KycCountry[] = [];
  @ViewChild('countryInput') countryInput: ElementRef;

  ngOnInit() {

    // this.checkUserInfo();

    this.getCountryCode();
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
      countryCode: new FormControl('', {validators: [
          Validators.required
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
      address: new FormControl('', {validators: [
          Validators.required
        ]
      }),
      city: new FormControl('', {validators: [
          Validators.required
        ]
      }),
      theCheckbox: new FormControl('', {validators: [
          Validators.required
        ]
      }),
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
  get currentAddress(): any {
    return this.form.get('address');
  }
  get currentCity(): any {
    return this.form.get('city');
  }

  gotToStepTwo(form: any) {
      if(form.valid && this.form.controls.theCheckbox.value == true) {
        console.log(form);
        let account: BankVerification = {
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          address: form.value.address,
          countryCode: form.value.countryCode,
          city: form.value.city,
          currencyCode: 'euro'
        };
        console.log(account);
        let obj = new Object;
        console.log(obj);
        this.balanceService.postFUGAccount(obj).pipe(first()).subscribe(responce => {
          console.log(responce);
          this.nextStep.emit(2);
        });
      }
  }

  checked(e) {
    this.check = e.target.checked;
    this.form.controls.theCheckbox.setValue(e.target.checked);
  }


  @HostListener('document:click', ['$event']) clickout({target}) {
    if (target.className !== 'select__value select__value--active'
      && target.className !== 'select__value select__value--active select__value--error'
      && target.className !== 'select__search-input') {
      this.countryInput.nativeElement.value = this.selectedCountry ? this.selectedCountry.countryName : '';
      this.openCountryDropdown = false;
    }
  }
  

  getCountryCode() {
    this.settingsService.getCountriesKYC().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.countryArrayDefault = res as KycCountry[];
        this.countryArray = this.countryArrayDefault;
        console.log(this.countryArray);
      });
  }

  countryDropdownToggle() {
    this.countryInput.nativeElement.value = this.selectedCountry ? this.selectedCountry.countryName : '';
    this.openCountryDropdown = !this.openCountryDropdown;
    this.countryArray = this.countryArrayDefault;
  }
  showCountryLabel(flag: boolean) {
    this.showCountryLabelFlag = flag;
  }

  selectCountry(country) {
    this.selectedCountry = country;
    this.countryDropdownToggle();
    this.form.controls.country.setValue(country.countryName);
    this.form.controls.countryCode.setValue(country.countryCode);
  }
  
  searchCountry(e) {
    this.countryArray = this.countryArrayDefault.filter(f => f.countryName.toUpperCase().match(e.target.value.toUpperCase()));
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
