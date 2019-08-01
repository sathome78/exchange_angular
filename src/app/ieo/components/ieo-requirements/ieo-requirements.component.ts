import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { KycIEOModel } from 'app/ieo/models/ieo-kyc.model';
import { NotAllowedCountries } from 'app/ieo/JSONData';

@Component({
  selector: 'app-ieo-requirements',
  templateUrl: './ieo-requirements.component.html',
  styleUrls: ['./ieo-requirements.component.scss'],
})
export class IEORequirementsComponent implements OnInit {
  @Input('isAuthenticated') public isAuthenticated: boolean = false;
  @Input('requirements') public requirements: KycIEOModel;
  @Output('showPolicy') public showPolicy: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  // isBoolean(val) {
  //   return typeof val === 'boolean';
  // }
  public countries = NotAllowedCountries.join(', ');

  onToggleText() {
    var height = document.querySelector('.requirement-text-inner').clientHeight;
    if (!document.getElementById('requirement-text').classList.contains('opened')) {
      document.getElementById('requirement-text').style.height = height + 'px';
      document.querySelector('.requirement-item .more-btn').innerHTML = 'Show less';
      document.getElementById('requirement-text').classList.add('opened');
    } else {
      document.querySelector('.requirement-item .more-btn').innerHTML = 'Show more';
      document.getElementById('requirement-text').style.height = '';
      document.getElementById('requirement-text').classList.remove('opened');
    }
  }

  preventDefault(e) {
    e.preventDefault();
  }

  policyOpen(e) {
    this.preventDefault(e);
    this.showPolicy.emit();
  }
}
