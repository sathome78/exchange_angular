import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'app/shared/services/utils.service';
import { keys } from 'app/shared/constants';

@Component({
  selector: 'app-freecoins-captcha',
  templateUrl: './freecoins-captcha.component.html',
  styleUrls: ['./freecoins-captcha.component.scss'],
})
export class FreecoinsCaptchaComponent implements OnInit {
  @Output() public resolve = new EventEmitter<boolean>();
  @Output() public close = new EventEmitter<null>();
  public recaptchaKey = keys.recaptchaKey;

  constructor(
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
  }

  get isDevCaptcha() {
    return this.utilsService.isDevCaptcha();
  }

  closeMe() {
    this.close.emit();
  }

  afterResolvedCaptcha(value) {
    this.resolve.emit(value);
  }

}
