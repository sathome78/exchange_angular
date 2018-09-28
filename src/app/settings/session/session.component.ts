import {Component, OnInit} from '@angular/core';
import {Options} from 'ng5-slider';
import {SettingsService} from '../settings.service';
import {LoggingService} from '../../services/logging.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  value = 0;
  options: Options = {
    floor: 0,
    ceil: 1440
  };

  HOURS = 0;
  MINUTES = 0;
  form: FormGroup;
  hoursInput: FormControl;

  constructor(private settingsService: SettingsService,
              private logger: LoggingService) {
  }

  ngOnInit() {
    this.loadSessionInterval();
    this.setForm();
    this.subscribeForHoursUpdate();
    this.subscribeForMinutesUpdate();
  }

  onSubmit() {

  }

  setForm() {
    this.hoursInput = new FormControl(0, {
      validators: [Validators.min(0), Validators.max(24)],
      updateOn: 'blur'
    });
    this.form = new FormGroup({
      'hours': this.hoursInput,
      'minutes': new FormControl(this.getMinutes(), {
        validators: [Validators.min(0), Validators.max(59), this.minutesRangeMatch.bind(this)]
      }),
    });
  }

  private loadSessionInterval() {
    this.settingsService.getSessionInterval().subscribe(
      interval => {
        this.value = interval;
        this.form.get('minutes').patchValue(this.getMinutes());
        this.hoursInput.patchValue(this.getHours());
      },
      err => {
        this.logger.info(this, 'Failed to load session time: ' + err);
      });
  }

  minutesRangeMatch(minutes: FormControl): { [s: string]: boolean } {
    if (this.hoursInput.value > 23 && minutes.value > 0) {
      return null;
    }
    return {'24hoursLimit': true};
  }

  subscribeForHoursUpdate() {
    this.hoursInput.valueChanges.subscribe(h => {
      const hours = +h;
      if (hours >= 0 && hours <= 24) {
        this.HOURS = hours;
        this.updateValue();
      }
    });
  }

  subscribeForMinutesUpdate() {
    this.form.get('minutes').valueChanges.subscribe(m => {
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
    this.HOURS = parseInt((this.value / 60) + '', 0);
    this.hoursInput.patchValue(this.HOURS);
    // console.log('%: ' + (this.value % 60) + ' val: ' + this.value);
    this.MINUTES = parseInt((this.value % 60) + '', 0);
    this.MINUTES = this.HOURS === 24 ? 0 : this.MINUTES;
    this.form.get('minutes').patchValue(this.MINUTES);
    // console.log('H: ' + this.HOURS);
    // console.log('M: ' + this.MINUTES);
  }

  getMinutes() {
    this.MINUTES = parseInt((this.value % 60) + '', 0);
    return this.MINUTES;
  }

  getHours() {
    this.HOURS = parseInt((this.value / 60) + '', 0);
    return this.HOURS;
  }
}
