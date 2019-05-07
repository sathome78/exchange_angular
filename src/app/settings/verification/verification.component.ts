import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {UserVerificationService} from '../../shared/services/user-verification.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AuthService} from '../../shared/services/auth.service';
import {select, Store} from '@ngrx/store';
import {getVerificationStatus, State} from '../../core/reducers';
import {IMyDpOptions, IMyDefaultMonth} from 'mydatepicker';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {KYC_STATUS} from '../../shared/constants';
import * as moment from 'moment';
import {KycCountry} from '../../shared/interfaces/kyc-country-interface';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public KYC_STATUS = KYC_STATUS;
  public verificationStatus;
  public pattern = 'upholding.biz';
  public isInputFocus = false;
  public showComponent;
  public modelDateTo = null;
  public charPattern = '[a-zA-Z]+';
  public form: FormGroup;
  public dataModel;
  public openCountryDropdown = false;
  public openDocTypeDropdown = false;
  public defaultMonth: IMyDefaultMonth = {
    defMonth: `01/${moment().subtract(16, 'years').year()}`
  };
  public loading: boolean = false;
  private countryList: KycCountry[] = [];
  public countryListView: KycCountry[] = [];
  public selectedCountry: KycCountry;

  public docTypes = [
    {name: this.translateService.instant('Passport'), value: 'P'},
    {name: this.translateService.instant('ID card'), value: 'ID'},
  ]

  public currentDocType = this.docTypes[0]


  defaultModel = {
    docType: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    firstNames: [],
    lastName: '',
    country: ''
  };

  public myDatePickerOptions: IMyDpOptions = {
    showInputField: false,
    showTodayBtn: false,
    markCurrentDay: false,
    markCurrentMonth: false,
    markCurrentYear: false,
    disableUntil: {year: +moment().subtract(100, 'years').year(), month: 1, day: 1},
    dateFormat: 'dd.mm.yyyy',
    disableSince: {year: +moment().subtract(15, 'years').year(), month: 1, day: 1}
  };

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active' && $event.target.className !== 'select__search-input') {
      this.openCountryDropdown = false;
      this.openDocTypeDropdown = false;
      this.countryListView = this.countryList;
    }
  }
  constructor(private popupService: PopupService,
              private verificationService: UserVerificationService,
              private translateService: TranslateService,
              private authService: AuthService,
              private cdr: ChangeDetectorRef,
              private store: Store<State>,
  ) {
  }

  ngOnInit() {
    this.dataModel = this.defaultModel;
    this.initForm();


    this.store.pipe(select(getVerificationStatus))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.verificationStatus = res;
        if (this.verificationStatus === this.KYC_STATUS.NONE) {
          this.getCountries();
        }
      });

    this.showComponent = this.isDemo() ? this.isUpholding() : true;

  }

  private getCountries() {
    this.verificationService.getCountryList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.countryList = this.countryListView = res;
        this.selectedCountry = this.countryList[0];
      });
  }

  isUpholding(): boolean {
    return !!this.authService.getUsername().match(this.pattern);
  }
  isDemo() {
    return window.location.hostname.indexOf('demo.exrates') >= 0;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  restartProcedure() {
    this.verificationStatus = KYC_STATUS.NONE;
  }

  inputFocus(event) {
    this.isInputFocus = event;
    this.cdr.detectChanges();
  }

  private initForm() {
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(this.charPattern)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(this.charPattern)]),
    });
  }

  sendForm() {
    if (this.form.valid && !!this.modelDateTo) {
      this.dataModel.birthDay = this.modelDateTo.date.day;
      this.dataModel.birthMonth = this.modelDateTo.date.month;
      this.dataModel.birthYear = this.modelDateTo.date.year;
      this.dataModel.firstNames.push(this.form.get('firstName').value);
      this.dataModel.lastName = this.form.get('lastName').value;
      this.dataModel.country = this.selectedCountry.countryCode;
      this.dataModel.docType = this.currentDocType.value;
      this.loading = true;
      this.verificationService.sendKYCData(this.dataModel)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          window.open(res.data.url, '_blank');
          // this.verificationStatus = KYC_STATUS.PENDING;
          // this.popupService.showKYCPopup(2, res.data.url);
          this.form.reset();
          this.dataModel = this.defaultModel;
          this.loading = false;
        }, err => {
          this.dataModel.firstNames = [];
          console.error(err);
          this.loading = false;
        });
    }

  }

  private checkAge(event) {
    const formatted = event.formatted;
    if (new RegExp(/\d{2}.\d{2}.\d{4}$/).test(formatted) || new RegExp(/\d{1}.\d{1}.\d{4}$/).test(formatted)) {
      const arrDate = formatted.split('.');
      const checkDate = moment(formatted, 'DD.MM.YYYY');
      this.modelDateTo = {
        date: {
          year: +arrDate[2],
          month: +arrDate[1],
          day: +arrDate[0]
        }
      }
      if (checkDate.unix() > moment().subtract(16, 'years').unix()) {
        this.modelDateTo = {
          date: {
            year: +moment().subtract(16, 'years').year(),
            month: +arrDate[1],
            day: +arrDate[0]
          }
        };
      }
      if (checkDate.unix() < moment().subtract(100, 'years').unix()) {
        this.modelDateTo = {
          date: {
            year: +moment().subtract(100, 'years').year(),
            month: +arrDate[1],
            day: +arrDate[0]
          }
        };
      }
    }
  }

  clearModelDateTo() {
    this.modelDateTo = null;
    this.cdr.detectChanges();
  }

  countryDropdownToggle() {
    this.openCountryDropdown = !this.openCountryDropdown;
    this.openDocTypeDropdown = false;
    this.countryListView = this.countryList;
  }

  documentTypeDropdownToggle() {
    this.openDocTypeDropdown = !this.openDocTypeDropdown;
    this.openCountryDropdown = false;
  }

  selectCountry(country: KycCountry) {
    this.selectedCountry = country;
    this.openCountryDropdown = false;
    this.countryListView = this.countryList;
  }

  selectDocType(doc) {
    this.currentDocType = doc;
    this.openDocTypeDropdown = false;
  }

  searchCountry({ target }) {
    this.countryListView = this.countryList.filter(f => f.countryName.toLowerCase().match(target.value.toLowerCase()));
  }
}
