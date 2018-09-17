import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.css']
})
export class NicknameComponent implements OnInit {

  form: FormGroup;
  private nameRegex = '^[\\A-Za-z-=]+$';

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      'nickname': new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.nameRegex)],
        updateOn: 'blur'
      })
    });
  }

  onSubmit() {

  }

}
