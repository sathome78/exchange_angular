import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { getLanguage, State } from '../../core/reducers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
