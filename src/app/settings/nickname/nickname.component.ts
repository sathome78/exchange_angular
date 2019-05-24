import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { LoggingService } from '../../shared/services/logging.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.css'],
})
export class NicknameComponent implements OnInit, OnDestroy {

  form: FormGroup;
  private nameRegex = '^[\\A-Za-z-=]+$';
  nickname = '';
  statusMessage = '';
  isUpdateDisabled = false;
  NICK = 'nickname';

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private settingsService: SettingsService,
              private logger: LoggingService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      nickname: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.nameRegex)],
        updateOn: 'blur',
      }),
    });
    this.loadNickname();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadNickname() {
    this.settingsService.getNickname()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const nickname = res[this.NICK];
        this.nickname = nickname;
        if (nickname) {
          this.form.get(this.NICK).patchValue(nickname);
          this.isUpdateDisabled = true;
        }
      },
                 err => {
                   this.logger.info(this, err);
          // this.statusMessage = 'Failed to update your nickname!';
                 });

  }

  onSubmit() {
    if (this.isNicknameUpdated()) {
      const nickname = this.form.get(this.NICK).value;
      this.settingsService.updateNickname(nickname)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((event: HttpEvent<Object>) => {
          if (event.type === HttpEventType.Sent) {
            this.logger.debug(this, 'Nickname is successfully updated: ' + nickname);
            this.statusMessage = this.translateService.instant('Your nickname is successfully updated!');
          }
        },
                   err => {
                     const status = err['status'];
                     if (status >= 400) {
                       this.logger.info(this, 'Failed to update user nickname: ' + nickname);
                       this.statusMessage = this.translateService.instant('Failed to update your nickname!');
                     }
                   });
    }
  }

  isNicknameUpdated() {
    const newNickname = this.form.get(this.NICK).value;
    return this.form.valid && newNickname && newNickname !== this.nickname;
  }

}
