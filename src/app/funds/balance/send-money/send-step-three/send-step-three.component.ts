import { Component, Input, OnInit } from '@angular/core';
import { WITH_CODE, BY_PRIVATE_CODE, BY_CODE, BY_EMAIL } from '../send-money-constants';
import { select, Store } from '@ngrx/store';
import * as fromCore from '../../../../core/reducers';

@Component({
  selector: 'app-send-step-three',
  templateUrl: './send-step-three.component.html',
  styleUrls: ['./send-step-three.component.scss'],
})
export class SendStepThreeComponent implements OnInit {
  @Input() choosedName: string;
  @Input() data;
  public WITH_CODE = WITH_CODE;
  public BY_PRIVATE_CODE = BY_PRIVATE_CODE;
  public BY_CODE = BY_CODE;
  public BY_EMAIL = BY_EMAIL;
  public userInfo$;

  constructor(private store: Store<fromCore.State>) {}

  ngOnInit() {
    this.userInfo$ = this.store.pipe(select(fromCore.getUserInfo));
  }
}
