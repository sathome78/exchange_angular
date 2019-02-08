import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../shared/services/utils.service';
import {StaticPagesService} from '../static-pages.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PopupService} from '../../shared/services/popup.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  public sendForm: FormGroup;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private utilsService: UtilsService,
    private staticPagesService: StaticPagesService,
    private popupService: PopupService
  ) {
  }

  ngOnInit() {
    this.sendForm = new FormGroup({
      name: new FormControl('', { validators: [
        Validators.required,
          Validators.maxLength(30)
        ]}),
      email: new FormControl('', { validators: [
        Validators.required, this.utilsService.emailValidator(),
          this.utilsService.specialCharacterValidator(),
          Validators.maxLength(30)
        ]}),
      telegram: new FormControl('', Validators.maxLength(30)),
      text: new FormControl('', { validators: [
        Validators.required,
          Validators.maxLength(400)
        ]}),
    }, {updateOn: 'blur'});
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
        text: this.textControl.value
      };
      this.staticPagesService.sendContactForm(data)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          const popupData = {
            title: 'Your message was sent successfully!',
            description: 'Exrates team will contact you next 8 hours.',
          };
          this.popupService.toggleInfoPopup(popupData);
          this.sendForm.reset();
      });
    }
  }
}
