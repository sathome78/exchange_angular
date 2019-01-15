import {Component, OnDestroy, OnInit} from '@angular/core';
import {Options} from 'ng5-slider';
import {SettingsService} from '../settings.service';
import {LoggingService} from '../../shared/services/logging.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit, OnDestroy {

  value = 0;
  MIN_VALUE = 5;
  MAX_VALUE = 120;
  options: Options = {
    floor: this.MIN_VALUE,
    ceil: this.MAX_VALUE,
    showSelectionBar: true
  };

  statusMessage = '';
  HOURS = 0;
  MINUTES = 0;
  form: FormGroup;
  hoursInput: FormControl;
  minutesInput: FormControl;

  hoursInputSubscription: Observable<string>;
  minutesInputSubscription: Observable<string>;

  constructor(private settingsService: SettingsService,
              private logger: LoggingService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.loadSessionInterval();
    this.setForm();
    this.subscribeForInputChanges();
  }

  onSubmit() {
    if (this.value >= this.MIN_VALUE && this.value < this.MAX_VALUE) {
      this.settingsService.updateSessionInterval(this.value)
        .subscribe(resp => {
            this.statusMessage = this.translateService.instant('Session period is updated!');
          },
          err => {
            const status = err['status'];
            if (status >= 400) {
              this.statusMessage = this.translateService.instant('Session period is not updated!');
            }
          });
    } else {
      this.statusMessage = this.translateService.instant('Session must within 5 and 1440 mins (24 hours)');
    }
  }

  setForm() {
    this.hoursInput = new FormControl(this.getHours(this.value), {
      validators: [Validators.min(0), Validators.max(24)]
    });
    this.minutesInput = new FormControl(this.getMinutes(this.value), {
      validators: [Validators.min(0), Validators.max(59), this.minutesRangeMatch.bind(this)]
    });
    this.form = new FormGroup({
      'hours': this.hoursInput,
      'minutes': this.minutesInput,
    });
  }

  private loadSessionInterval() {
    this.settingsService.getSessionInterval().subscribe(
      interval => {
        this.minutesInput.patchValue(this.getMinutes(interval));
        this.hoursInput.patchValue(this.getHours(interval));
        this.value = interval;
      },
      err => {
        this.logger.info(this, 'Failed to load session time: ' + err);
      });
  }

  minutesRangeMatch(minutes: FormControl): { [s: string]: boolean } {
    const h = +this.hoursInput.value;
    const m = +minutes.value;
    if (h > 23 && m > 0) {
      return {'24hoursLimit': true};
    }
    return null;
  }

  subscribeForHoursUpdate() {
    this.hoursInputSubscription.subscribe(h => {
      const hours = +h;
      if (hours >= 0 && hours <= 24) {
        this.HOURS = hours;
        this.updateValue();
      }
    });
  }

  subscribeForMinutesUpdate() {
    this.minutesInputSubscription.subscribe(m => {
      const minutes = +m;
      if (minutes >= 0 && minutes < 60) {
        this.MINUTES = minutes;
        this.updateValue();
      }
    });
  }

  private updateValue() {
    this.value = (this.HOURS * 60) + this.MINUTES;
  }

  update() {
    this.ngOnDestroy();
    this.HOURS = parseInt((this.value / 60) + '', 0);
    this.MINUTES = parseInt((this.value % 60) + '', 0);
    this.MINUTES = this.HOURS === 24 ? 0 : this.MINUTES;
    this.hoursInput.patchValue(this.HOURS);
    this.minutesInput.patchValue(this.MINUTES);
    // this.subscribeForInputChanges();
    this.statusMessage = '';
  }

  getMinutes(interval: number) {
    this.MINUTES = parseInt((interval % 60) + '', 0);
    return this.MINUTES;
  }

  getHours(interval: number) {
    this.HOURS = parseInt((interval / 60) + '', 0);
    return this.HOURS;
  }

  private subscribeForInputChanges() {
    this.hoursInputSubscription = this.hoursInput.valueChanges;
    this.subscribeForHoursUpdate();
    this.minutesInputSubscription = this.form.get('minutes').valueChanges;
    this.subscribeForMinutesUpdate();
  }

  ngOnDestroy(): void {
    this.hoursInputSubscription = undefined;
    this.minutesInputSubscription = undefined;
  }
}
