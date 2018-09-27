import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SettingsService} from '../settings.service';
import {LoggingService} from '../../services/logging.service';

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.css']
})
export class NicknameComponent implements OnInit {

  form: FormGroup;
  private nameRegex = '^[\\A-Za-z-=]+$';
  nickname = '';
  statusMessage = '';

  constructor(private settingsService: SettingsService,
              private logger: LoggingService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'nickname': new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.nameRegex)],
        updateOn: 'blur'
      })
    });
    this.loadNickname();
  }

  loadNickname() {
    this.settingsService.getNickname()
      .subscribe(res => {
          const nickname = res['nickname'];
          this.nickname = nickname;
          if (nickname) {
            this.form.get('nickname').patchValue(nickname);
          }
        },
        err => {
          this.logger.info(this, err);
          // this.statusMessage = 'Failed to update your nickname!';
        });

  }

  onSubmit() {

  }

}
