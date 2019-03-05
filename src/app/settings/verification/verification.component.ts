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
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';
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
  public isSubmited = false;

  defaultModel = {
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    firstNames: [],
    lastName: ''
  }


  constructor(private popupService: PopupService,
              private verificationService: UserVerificationService,
              private authService: AuthService,
              private store: Store<State>,
              ) {}

  ngOnInit() {
    this.dataModel = this.defaultModel;
    this.initForm();


    this.store.pipe(select(getVerificationStatus))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.verificationStatus = res as string;
    });

    this.popupService
      .getKYCPopupListener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        if (!value) {
          this.store.dispatch(new coreAction.LoadVerificationStatusAction());
        }
      });
     // this.showComponent = this.authService.getUsername().match(this.pattern) ? true : false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onOpenIdentityPopup(mode: string) {
    this.verificationService.setVerificationMode(mode);
    this.popupService.showIdentityPopup(mode);
  }

  onOpenKYCPopup(level: number, ) {
    if (level === 1 && this.verificationStatus === NOT_VERIFIED || level === 2 && this.verificationStatus === LEVEL_ONE ) {
      this.popupService.showKYCPopup(1);
    }
  }

  inputFocus(event) {
    this.isInputFocus = event;
  }

  private initForm() {
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      dateBirth: new FormControl('', [Validators.required, Validators.pattern(this.patternDataBirth)]),
    });
  }

  sendForm() {
    this.isSubmited = true;
    if (this.form.valid) {
      const arrDate = this.form.get('dateBirth').value.split('.');
      this.dataModel.birthDay = arrDate[0];
      this.dataModel.birthMonth = arrDate[1];
      this.dataModel.birthYear = arrDate[2];
      this.dataModel.firstNames.push(this.form.get('firstName').value);
      this.dataModel.lastName = this.form.get('lastName').value;
      this.verificationService.sendKYCData(this.dataModel)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
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
         if (checkDate.unix() > moment().subtract(16, 'years').unix()) {
           this.modelDateTo = {
             date: {
               year: +moment().subtract(16, 'years').year(),
               month: +arrDate[1],
               day: +arrDate[0]
             }
           };
           this.form.controls['dateBirth'].setValue(`${+arrDate[0]}.${+arrDate[1]}.${+moment().subtract(16, 'years').year()}`);
         }
        if (checkDate.unix() < moment().subtract(100, 'years').unix()) {
          this.modelDateTo = {
            date: {
              year: +moment().subtract(100, 'years').year(),
              month: +arrDate[1],
              day: +arrDate[0]
            }
          };
          this.form.controls['dateBirth'].setValue(`${+arrDate[0]}.${+arrDate[1]}.${+moment().subtract(100, 'years').year()}`);
        }
      }
    }

}
