import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../../shared/services/utils.service';
import { StaticPagesService } from '../static-pages.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PopupService } from '../../shared/services/popup.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit, OnDestroy {

  public sendForm: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public loading: boolean = false;

  constructor(
    private utilsService: UtilsService,
    private staticPagesService: StaticPagesService,
    private translateService: TranslateService,
    private popupService: PopupService,
  ) {
  }

  ngOnInit() {
    this.sendForm = new FormGroup({
      name: new FormControl('', { validators: [
        Validators.required,
        Validators.maxLength(30),
      ]}),
      email: new FormControl('', { validators: [
        Validators.required, this.utilsService.emailValidator(),
        this.utilsService.specialCharacterValidator(),
        Validators.maxLength(40),
      ]}),
      telegram: new FormControl('', Validators.maxLength(30)),
      text: new FormControl('', { validators: [
        Validators.required,
        Validators.maxLength(400),
      ]}),
    },                            { updateOn: 'blur' });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get nameControl() {
    return this.sendForm.get('name');
  }
  get emailControl() {
    return this.sendForm.get('email');
  }
  get telegramControl() {
    return this.sendForm.get('telegram');
  }
  get textControl() {
    return this.sendForm.get('text');
  }

  onSendForm() {
    if (this.sendForm.valid) {
      const data = {
        name: this.nameControl.value,
        email: this.emailControl.value,
        telegram: this.telegramControl.value,
        text: this.textControl.value,
      };
      this.loading = true;
      this.staticPagesService.sendContactForm(data)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          const popupData = {
            title: this.translateService.instant('Your message was sent successfully!'),
            description: this.translateService.instant('Exrates team will contact you next 8 hours.'),
          };
          this.popupService.toggleInfoPopup(popupData);
          this.sendForm.reset();
          this.loading = false;
        },         err => {
          console.error(err);
          this.loading = false;
        });
    }
  }
}
