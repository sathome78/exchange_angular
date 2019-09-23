import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { KycCountry } from 'app/shared/interfaces/kyc-country-interface';
import { SettingsService } from 'app/settings/settings.service';
import { BalanceService } from 'app/funds/services/balance.service';
import { BankVerification } from 'app/model/bank-veryfication.model';
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
})
export class StepOneComponent implements OnInit, OnDestroy {

  constructor(
    private balanceService: BalanceService,
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
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

  get currentDatePicker(): any {
    return this.form.get('datepicker');
  }
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public loading = false;
  public form: FormGroup;
  public check = false;
  public modelDateFrom: any;
  public isDateInputFromFocus = false;

  // country

  public openCountryDropdown: Boolean = false;
  public showCountryLabelFlag: Boolean = false;
  public selectedCountry;
  public countryArray: KycCountry[] = [];
  public countryArrayDefault: KycCountry[] = [];

  @Output() public nextStep: EventEmitter<any> = new EventEmitter();
  @Output() closeQuberaKycPopup = new EventEmitter<boolean>();

  @ViewChild('countryInput') countryInput: ElementRef;

  public myDatePickerOptions: IMyDpOptions = {
    showInputField: false,
    openSelectorTopOfInput: true,
    minYear: new Date().getFullYear() - 90,
    maxYear: new Date().getFullYear() - 18,
    dateFormat: 'dd.mm.yyyy',
    disableSince: {
      year: new Date().getFullYear() - 18,
      month: new Date().getMonth() + 1,
      day: new Date().getDate() + 1,
    },
  };

  @HostListener('document:click', ['$event']) clickout({ target }) {
    if (
      target.className !== 'select__value select__value--active' &&
      target.className !== 'select__value select__value--active select__value--error' &&
      target.className !== 'select__search-input'
    ) {
      this.countryInput.nativeElement.value = this.selectedCountry ? this.selectedCountry.countryName : '';
      this.openCountryDropdown = false;
    }
  }

  ngOnInit() {
    // this.checkUserInfo();
    this.getCountryCode();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initForm() {
    this.form = new FormGroup({
      country: new FormControl('', { validators: [Validators.required] }),
      countryCode: new FormControl('', { validators: [Validators.required] }),
      firstName: new FormControl('', { validators: [Validators.required] }),
      lastName: new FormControl('', { validators: [Validators.required] }),
      address: new FormControl('', { validators: [Validators.required] }),
      city: new FormControl('', { validators: [Validators.required] }),
      datepicker: new FormControl('', { validators: [Validators.required] }),
      theCheckbox: new FormControl('', { validators: [Validators.required] }),
    });
    this.form.controls.theCheckbox.setValue(false);
    this.form.controls.datepicker.setValue({
      date: {
        year: new Date().getFullYear() - 18,
        month: new Date().getMonth() + 1,
        day: new Date().getDate() + 1,
      },
    });
  }

  gotToStepTwo(form: any) {
    if (form.valid && this.form.controls.theCheckbox.value === true) {
      const account: BankVerification = {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        address: form.value.address,
        countryCode: form.value.countryCode,
        city: form.value.city,
        birthDay: `${this.modelDateFrom.date.day}`,
        birthMonth: `${this.modelDateFrom.date.month}`,
        birthYear: `${this.modelDateFrom.date.year}`,
      };
      this.loading = true;
      this.balanceService
        .postFUGAccount(account)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (response: any) => {
            const newWnd = window.open(`${response.data.url}`, '_blank');
            newWnd.opener = null;
            this.loading = false;
            this.nextStep.emit(2);
          },
          error => {
            this.loading = false;
          }
        );
    }
  }

  checked(e) {
    this.check = e.target.checked;
    this.form.controls.theCheckbox.setValue(e.target.checked);
  }

  getCountryCode() {
    this.settingsService
      .getCountriesKYC()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.countryArrayDefault = res as KycCountry[];
        this.countryArray = this.countryArrayDefault;
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
    this.countryArray = this.countryArrayDefault.filter(f =>
      f.countryName.toUpperCase().match(e.target.value.toUpperCase())
    );
  }

  clearModelDateFrom() {
    this.modelDateFrom = null;
  }

  focusOrBlurDateFrom(event) {
    this.isDateInputFromFocus = event;
    this.cdr.detectChanges();
  }

  onDateChanged(event: any) {
    this.modelDateFrom = { date: event.date };
    this.form.controls.datepicker.setValue(this.modelDateFrom);
  }

  // old method for check mail don't delete
  // checkUserInfo() {
  //   this.store
  //     .pipe(first(),
  //           select(getUserInfo),
  //           switchMap(user => this.mail = user.username))
  //     .pipe(first(),
  //           switchMap(data => {return this.userService.getCheckTo2FAEnabled(this.mail)}))
  //     .subscribe(user => {
  //     });
  // }

  trackByFn(index, item) {
    return item.countryName;
  }
}
