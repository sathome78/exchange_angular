import { Component, OnDestroy, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { SettingsService } from '../settings.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { PopupService } from 'app/shared/services/popup.service';
import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import * as settingsActions from '../store/actions/settings.actions';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit, OnDestroy {

  value = 0;
  oldValue = 0;
  MIN_VALUE = 5;
  MAX_VALUE = 120;
  options: Options = {
    floor: this.MIN_VALUE,
    ceil: this.MAX_VALUE,
    showSelectionBar: true,
  };

  statusMessage = '';
  HOURS = 0;
  MINUTES = 0;
  form: FormGroup;
  hoursInput: FormControl;
  minutesInput: FormControl;
  sessionTime$: Observable<number>;

  loading: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private settingsService: SettingsService,
              private popupService: PopupService,
              private store: Store<fromCore.State>) {
  }

  ngOnInit() {
    this.setForm();
    this.sessionTime$ = this.store.pipe(select(fromCore.getSessionTime));
    this.sessionTime$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((interval) => {
        this.minutesInput.patchValue(this.getMinutes(interval));
        this.hoursInput.patchValue(this.getHours(interval));
        this.value = interval;
        this.oldValue = interval;
        this.validateHours();
        this.validateMinutes();
      });
  }

  onSubmit() {
    if (this.value >= this.MIN_VALUE && this.value <= this.MAX_VALUE) {
      this.loading = true;
      this.settingsService.updateSessionInterval(this.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(resp => {
          this.popupService.toggleSessionTimeSavedPopup(true);
          this.store.dispatch(new settingsActions.SetSessionTimeAction(this.value));
          this.oldValue = this.value;
          this.loading = false;
        },
                   err => {
                     console.error(err);
                     this.loading = false;
                   });
    }
  }

  setForm() {
    this.hoursInput = new FormControl(this.getHours(this.value), {
      validators: [Validators.min(0), Validators.max(2)],
    });
    this.minutesInput = new FormControl(this.getMinutes(this.value), {
      validators: [Validators.min(0), Validators.max(59)],
    });
    this.form = new FormGroup({
      hours: this.hoursInput,
      minutes: this.minutesInput,
    });
  }

  validateHours() {
    const h = this.hoursInput.value;
    if (h === null) {
      this.HOURS = 0;
    } else if (+h >= 0 && +h <= 2) {
      this.HOURS = +h;
    } else if (+h > 2) {
      this.hoursInput.setValue(2);
      this.HOURS = 2;
    } else if (+h < 0) {
      this.hoursInput.setValue(0);
      this.HOURS = 0;
    }
    this.updateValue();
  }

  validateMinutes() {
    if (this.minutesInput.value && this.minutesInput.value.length > 2) {
      this.minutesInput.setValue(this.minutesInput.value.substr(0, 2));
    }
    if (+this.minutesInput.value) {
      if (this.minutesInput.value < 0) {
        this.MINUTES = 0;
        this.minutesInput.setValue('0');
      } else if (this.minutesInput.value >= 60) {
        this.minutesInput.setValue('59');
        this.MINUTES = 59;
      } else {
        this.MINUTES = +this.minutesInput.value;
      }
    } else {
      this.minutesInput.setValue('00');
    }

    this.updateValue();
  }

  formatMinutes() {
    const minutes = +this.minutesInput.value;
    if (this.HOURS === 2) {
      this.minutesInput.setValue('00');
    } else if (this.HOURS === 0) {
      if (this.minutesInput.value === null) {
        this.minutesInput.setValue('05');
      } else if (minutes < 5) {
        this.minutesInput.setValue('05');
      } else if (minutes >= 5 && minutes < 10) {
        this.minutesInput.setValue('0' + minutes);
      } else if (minutes >= 10 && minutes < 60) {
        this.minutesInput.setValue(minutes + '');
      } else if (minutes >= 60) {
        this.minutesInput.setValue('59');
      }
    } else {
      if (this.minutesInput.value === null) {
        this.minutesInput.setValue('00');
      } else if (minutes < 0) {
        this.minutesInput.setValue('00');
      } else if (minutes >= 0 && minutes < 10) {
        this.minutesInput.setValue('0' + minutes);
      } else if (minutes >= 10 && minutes < 60) {
        this.minutesInput.setValue(minutes + '');
      } else if (minutes >= 60) {
        this.minutesInput.setValue('59');
      }
    }
  }

  formatHours() {
    const h = this.hoursInput.value;
    if (h === null) {
      this.hoursInput.setValue(0);
    } else if (+h >= 0 && +h <= 2) {

    } else if (+h > 2) {
      this.hoursInput.setValue(2);
    } else if (+h < 0) {
      this.hoursInput.setValue(0);
    }
  }

  formatInputs() {
    this.formatHours();
    this.formatMinutes();
  }
  validateInputs() {
    this.validateHours();
    this.validateMinutes();
  }

  updateValue() {
    this.value = (this.HOURS * 60) + this.MINUTES;
  }

  update() {
    this.ngOnDestroy();
    this.HOURS = parseInt((this.value / 60) + '', 0);
    this.MINUTES = parseInt((this.value % 60) + '', 0);
    const minutesForForm = this.MINUTES < 10 ? '0' + this.MINUTES : '' + this.MINUTES;
    this.MINUTES = this.HOURS === 2 ? 0 : this.MINUTES;
    this.hoursInput.patchValue(this.HOURS);
    this.minutesInput.patchValue(minutesForForm);
    this.statusMessage = '';
    this.validateHours();
    this.validateMinutes();
  }

  getMinutes(interval: number) {
    this.MINUTES = parseInt((interval % 60) + '', 0);
    return this.MINUTES;
  }

  getHours(interval: number) {
    this.HOURS = parseInt((interval / 60) + '', 0);
    return this.HOURS;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
