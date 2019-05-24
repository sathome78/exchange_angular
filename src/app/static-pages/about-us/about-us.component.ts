import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { getLanguage, State } from '../../core/reducers';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
