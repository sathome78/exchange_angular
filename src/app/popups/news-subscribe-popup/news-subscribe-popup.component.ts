import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {UtilsService} from '../../shared/services/utils.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {NewsService} from '../../shared/services/news.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-news-subscribe-popup',
  templateUrl: './news-subscribe-popup.component.html',
  styleUrls: ['./news-subscribe-popup.component.scss']
})
export class NewsSubscribePopupComponent implements OnInit, OnDestroy {

  public emailForm: FormGroup;
  public resErrorMesage = '';
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public popupService: PopupService,
    private utilsService: UtilsService,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.initEmailForm();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // temp method
  openThankPopup() {
    this.popupService.toggleNewsThankYouPopup(true);
    this.closeSubPopup();
  }

  // temp method
  closeSubPopup() {
    this.popupService.toggleNewsSubscribePopup(false);
  }

  initEmailForm() {
    this.emailForm = new FormGroup({
      email: new FormControl('', { validators: [
          Validators.required, this.utilsService.emailValidator(),
          this.utilsService.specialCharacterValidator(),
          Validators.maxLength(40)
        ]}),
    });
  }

  get emailControl() {
    return this.emailForm.get('email');
  }

  sendEmail() {
    if (this.emailForm.valid) {
      this.resErrorMesage = '';
      this.newsService.subscribeToPartnerNews(this.emailControl.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.popupService.toggleNewsSubscribePopup(false);
          this.popupService.toggleNewsThankYouPopup(true);
        }, error => {
          if (error.status !== 400) {
            this.resErrorMesage = 'Service is temporary unavailable, please try again later.';
          }
        });
    }
  }

}
