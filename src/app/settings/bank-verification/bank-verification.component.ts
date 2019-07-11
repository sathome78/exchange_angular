import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { BankVerification } from 'app/model/bank-veryfication.model';
import { takeUntil } from 'rxjs/operators';
import { KycCountry } from 'app/shared/interfaces/kyc-country-interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bank-verification',
  templateUrl: './bank-verification.component.html',
  styleUrls: ['./bank-verification.component.scss']
})
export class BankVerificationComponent implements OnInit {

  form: FormGroup;
  
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public countryArray: KycCountry[] = [];
  public countryArrayDefault: KycCountry[] = [];
  @ViewChild('countryInput') countryInput: ElementRef;
  
  public openCountryDropdown: Boolean = false;
  public showCountryLabelFlag: Boolean = false;
  public selectedCountry;
  
  isSubmitted: Boolean = false;
  
  loading: boolean = false;

  constructor(private settingsService: SettingsService) {
    
    this.initFormVerificationBank();
  }

  ngOnInit() {
    this.getCountryCode();
  }

  initFormVerificationBank() {
    this.form = new FormGroup({
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
      countryCode: new FormControl('', {validators: [
          Validators.required
        ]
      }),
      currencyCode: new FormControl('', {validators: [
          Validators.required
        ]
      })
    })
  }


  showFormErrors() {
    this.isSubmitted = true;
    this.currentFirstName.markAsTouched();
    this.currentLastName.markAsTouched();
    this.currentAddress.markAsTouched();
    this.currentCity.markAsTouched();
    this.currentCountryCode.markAsTouched();
    // this.currentcurrencyCode.markAsTouched();
    this.currentFirstName.updateValueAndValidity();
    this.currentLastName.updateValueAndValidity();
    this.currentAddress.updateValueAndValidity();
    this.currentCity.updateValueAndValidity();
    this.currentCountryCode.updateValueAndValidity();
    // this.currentcurrencyCode.updateValueAndValidity();
  }

  onSubmit() {
    this.showFormErrors();
    if(this.form.valid) {
      // console.log(this.form);
      let obj = this.form.value;
      let verification = new BankVerification;
      verification.firstName = obj.firstName;
      verification.lastName = obj.lastName;
      verification.address = obj.address;
      verification.city = obj.city;
      verification.countryCode = obj.countryCode;
      // verification.currencyCode = obj.currencyCode;
      console.log(obj);
      this.settingsService.postBankVerification(obj).subscribe((bankVerify: BankVerification) => {
        console.log(bankVerify);
      })
    }
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
  get currentCountryCode(): any {
    return this.form.get('countryCode');
  }
  get currentcurrencyCode(): any {
    return this.form.get('currencyCode');
  }

    // DROPDOWN COUNTRY 
   /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout({target}) {
    if (target.className !== 'select__value select__value--active' &&
      target.className !== 'select__search-input no-line' &&
      target.className !== 'select__triangle') {
      this.countryInput.nativeElement.value = this.selectedCountry ? this.selectedCountry.countryName : '';
      this.openCountryDropdown = false;
    }
  }
  

  getCountryCode() {
    this.settingsService.getCountriesKYC().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.countryArrayDefault = res as KycCountry[];
        this.countryArray = this.countryArrayDefault;
      });
  }

  countryDropdownToggle(value = null) {
    this.countryInput.nativeElement.value = this.selectedCountry ? this.selectedCountry.countryName : '';
    this.openCountryDropdown = value ? value : !this.openCountryDropdown;
    this.countryArray = this.countryArrayDefault;
  }
  showCountryLabel(flag: boolean) {
    this.showCountryLabelFlag = flag;
  }

  selectCountry(country) {
    this.selectedCountry = country;
    this.countryDropdownToggle();
    this.form.controls.countryCode.setValue(country.countryCode);
  }
  
  searchCountry(e) {
    this.countryArray = this.countryArrayDefault.filter(f => f.countryName.toUpperCase().match(e.target.value.toUpperCase()));
  }

}
