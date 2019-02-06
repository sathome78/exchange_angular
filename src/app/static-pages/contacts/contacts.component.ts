import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../shared/services/utils.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  public sendForm: FormGroup;

  constructor(
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit() {
    this.sendForm = new FormGroup({
      name: new FormControl('', { validators: [Validators.required, Validators.maxLength(30)]}),
      email: new FormControl('', { validators: [Validators.required, this.utilsService.emailValidator(), this.utilsService.specialCharacterValidator(), Validators.maxLength(30)]}),
      telegram: new FormControl('', Validators.maxLength(30)),
      text: new FormControl('', { validators: [Validators.required, Validators.maxLength(400)]}),
    }, {updateOn: 'blur'});
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
    console.log(this.sendForm);
    if (this.sendForm.valid) {
      // send form
    }
  }
}
