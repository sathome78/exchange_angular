import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {getLanguage, State} from '../../core/reducers';
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
      name: new FormControl('', { validators: Validators.required }),
      email: new FormControl('', { validators: [Validators.required, this.utilsService.emailValidator(), this.utilsService.specialCharacterValidator()]}),
      telegram: new FormControl(''),
      text: new FormControl(''),
    });
  }

  onSendForm() {
    console.log(this.sendForm);
  }

}
