import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {UserVerificationService} from '../../shared/services/user-verification.service';
import {SettingsService} from '../settings.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NOT_VERIFIED, LEVEL_ONE, LEVEL_TWO} from '../../shared/constants';
import {AuthService} from '../../shared/services/auth.service';
import {select, Store} from '@ngrx/store';
import {getVerificationStatus, State} from '../../core/reducers';
import {SetVerificationStatusAction} from '../../core/actions/core.actions';
import * as coreAction from '../../core/actions/core.actions';
import {IMyDpOptions, IMyDateModel, IMyDefaultMonth} from 'mydatepicker';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public NOT_VERIFIED = NOT_VERIFIED;
  public LEVEL_ONE = LEVEL_ONE;
  public LEVEL_TWO = LEVEL_TWO;
  public verificationStatus = NOT_VERIFIED;
  public pattern = 'upholding.biz';
  public isInputFocus = false;
  public showComponent = true;
  public modelDateTo = null;
  public form: FormGroup;
  public patternDataBirth = /\d{2}.\d{2}.\d{4}$/;
  private dataModel;
  public defaultMonth: IMyDefaultMonth = {
    defMonth: `01/${moment().subtract(16, 'years').year()}`
  };

  defaultModel = {
    typeDoc: 'P',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    firstNames: [],
    lastName: ''
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

  constructor(private popupService: PopupService,
              private verificationService: UserVerificationService,
              private authService: AuthService,
              private store: Store<State>,
  ) {
  }

  ngOnInit() {
    this.dataModel = this.defaultModel;
    this.initForm();


    // this.store.pipe(select(getVerificationStatus))
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(res => {
    //     this.verificationStatus = res as string;
    //   });
    //
    // this.popupService
    //   .getKYCPopupListener()
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(value => {
    //     if (!value) {
    //       this.store.dispatch(new coreAction.LoadVerificationStatusAction());
    //     }
    //   });
    this.showComponent = this.authService.getUsername().match(this.pattern) ? true : false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // onOpenIdentityPopup(mode: string) {
  //   this.verificationService.setVerificationMode(mode);
  //   this.popupService.showIdentityPopup(mode);
  // }
  //
  // onOpenKYCPopup(level: number) {
  //   if (level === 1 && this.verificationStatus === NOT_VERIFIED || level === 2 && this.verificationStatus === LEVEL_ONE) {
  //     this.popupService.showKYCPopup(1);
  //   }
  // }

  inputFocus(event) {
    this.isInputFocus = event;
  }

  private initForm() {
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
    });
  }

  sendForm() {
    if (this.form.valid && !!this.modelDateTo) {
      this.dataModel.birthDay = this.modelDateTo.date.day;
      this.dataModel.birthMonth = this.modelDateTo.date.month;
      this.dataModel.birthYear = this.modelDateTo.date.year;
      this.dataModel.firstNames.push(this.form.get('firstName').value);
      this.dataModel.lastName = this.form.get('lastName').value;
      this.verificationService.sendKYCData(this.dataModel)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.popupService.showKYCPopup(2, res.data.url);
          this.form.reset();
          this.dataModel = this.defaultModel;
        }, err => console.log(err));
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
  }

}
