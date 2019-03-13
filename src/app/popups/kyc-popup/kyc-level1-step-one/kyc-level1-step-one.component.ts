import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {SettingsService} from '../../../settings/settings.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {KycCountry} from '../../../shared/interfaces/kyc-country-interface';
import {KycLanguage} from '../../../shared/interfaces/kyc-language-interface';
import {LEVEL_ONE, LEVEL_TWO} from '../../../shared/constants';

@Component({
  selector: 'app-kyc-level1-step-one',
  templateUrl: './kyc-level1-step-one.component.html',
  styleUrls: ['./kyc-level1-step-one.component.scss']
})
export class KycLevel1StepOneComponent implements OnInit, OnDestroy {

  @ViewChild('countryInput') countryInput: ElementRef;
  @ViewChild('languageInput') languageInput: ElementRef;
  @Output() goToSecondStep = new EventEmitter<string>();
  @Input() verificationStatus: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public openLanguageDropdown = false;
  public openCountryDropdown = false;
  public load = false;
  public languageArray: KycLanguage[] = [];
  public countryArray: KycCountry[] = [];
  public languageArrayDefault: KycLanguage[] = [];
  public countryArrayDefault: KycCountry[] = [];
  public showCountryLabelFlag = false;
  public showLanguageLabelFlag = false;
  public selectedLanguage;
  public selectedCountry;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout({target}) {
    if (target.className !== 'select__value select__value--active' &&
      target.className !== 'select__search-input no-line' &&
      target.className !== 'select__triangle') {
      this.countryInput.nativeElement.value = this.selectedCountry ? this.selectedCountry.countryName : '';
      this.languageInput.nativeElement.value = this.selectedLanguage ? this.selectedLanguage.languageName : '';
      this.openLanguageDropdown = false;
      this.openCountryDropdown = false;
    }
  }

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.settingsService.getLanguagesKYC()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.languageArrayDefault = res as KycLanguage[];
        this.languageArray = this.languageArrayDefault;
      });
    this.settingsService.getCountriesKYC()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.countryArrayDefault = res as KycCountry[];
        this.countryArray = this.countryArrayDefault;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  languageDropdownToggle(value = null) {
    this.languageInput.nativeElement.value = this.selectedLanguage ? this.selectedLanguage.languageName : '';
    this.openCountryDropdown = false;
    this.openLanguageDropdown = value ? value : !this.openLanguageDropdown;
    this.languageArray = this.languageArrayDefault;
  }

  countryDropdownToggle(value = null) {
    this.countryInput.nativeElement.value = this.selectedCountry ? this.selectedCountry.countryName : '';
    this.openLanguageDropdown = false;
    this.openCountryDropdown = value ? value : !this.openCountryDropdown;
    this.countryArray = this.countryArrayDefault;
  }

  selectCountry(country) {
    this.selectedCountry = country;
    this.countryDropdownToggle();
  }

  showCountryLabel(flag: boolean) {
    this.showCountryLabelFlag = flag;
  }

  showLanguageLabel(flag: boolean) {
    this.showLanguageLabelFlag = flag;
  }

  searchLanguage(e) {
    this.languageArray = this.languageArrayDefault.filter(f => f.languageName.toUpperCase().match(e.target.value.toUpperCase()));
  }

  searchCountry(e) {
    this.countryArray = this.countryArrayDefault.filter(f => f.countryName.toUpperCase().match(e.target.value.toUpperCase()));
  }

  selectLanguage(lang) {
    this.selectedLanguage = lang;
    this.languageDropdownToggle();

  }

  sendStepOne() {
    this.load = true;
    this.settingsService.getIframeUrlForKYC(this.verificationStatus === LEVEL_ONE ? LEVEL_TWO : LEVEL_ONE, this.selectedLanguage.languageCode, this.selectedCountry.countryCode)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.load = false;
        this.goToSecondStep.emit(res);
      }, error => {
        console.error(error);
        this.load = false;
      });
  }
}
