import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from '../../../settings/settings.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {KycCountry} from '../../../shared/interfaces/kyc-country-interface';
import {KycLanguage} from '../../../shared/interfaces/kyc-language-interface';
import {LEVEL_ONE} from '../../../shared/constants';

@Component({
  selector: 'app-kyc-step-one',
  templateUrl: './kyc-step-one.component.html',
  styleUrls: ['./kyc-step-one.component.scss']
})
export class KycStepOneComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public openLanguageDropdown = false;
  public openCountryDropdown = false;
  public languageArray: KycLanguage[] = [];
  public countryArray: KycCountry[] = [];
  public selectedLanguage;
  public selectedCountry;

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.settingsService.getLanguagesKYC().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.languageArray = res as KycLanguage[];
        this.selectedLanguage = this.languageArray[0];
      });
    this.settingsService.getCountriesKYC().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.countryArray = res as KycCountry[];
        this.selectedCountry = this.countryArray[0];
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  languageDropdownToggle() {
    this.openLanguageDropdown = !this.openLanguageDropdown;
  }

  countryDropdownToggle() {
    this.openCountryDropdown = !this.openCountryDropdown;
  }

  selectCountry(country) {
    this.selectedCountry = country;
    this.countryDropdownToggle();
  }

  searchLanguage(event) {

  }

  selectLanguage(lang) {
    this.selectedLanguage = lang;
    this.languageDropdownToggle();

  }

  sendStepOne() {
    this.settingsService.getIframeUrlForKYC(LEVEL_ONE, this.selectedLanguage.languageCode, this.selectedCountry.countryCode)
      .subscribe(res => console.log(res));
  }
}
