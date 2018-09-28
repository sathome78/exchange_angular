import {Component, OnDestroy, OnInit} from '@angular/core';
import {Options} from 'ng5-slider';
import {SettingsService} from '../settings.service';
import {LoggingService} from '../../services/logging.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit, OnDestroy {

  value = 0;
  options: Options = {
    floor: 0,
    ceil: 1440
  };

  HOURS = 0;
  MINUTES = 0;
  form: FormGroup;
  hoursInput: FormControl;
  minutesInput: FormControl;

  hoursInputSubscription: Observable<string>;
  minutesInputSubscription: Observable<string>;

  constructor(private settingsService: SettingsService,
              private logger: LoggingService) {
  }

  ngOnInit() {
    this.loadSessionInterval();
    this.setForm();
    this.subscribeForInputChanges();
  }

  onSubmit() {

  }

  setForm() {
    this.hoursInput = new FormControl(this.getHours(), {
      validators: [Validators.min(0), Validators.max(24)]
    });
    this.minutesInput = new FormControl(this.getMinutes(), {
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
        this.value = interval;
        this.minutesInput.patchValue(this.getMinutes());
        this.hoursInput.patchValue(this.getHours());
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
  }

  getMinutes() {
    this.MINUTES = parseInt((this.value % 60) + '', 0);
    return this.MINUTES;
  }

  getHours() {
    this.HOURS = parseInt((this.value / 60) + '', 0);
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
