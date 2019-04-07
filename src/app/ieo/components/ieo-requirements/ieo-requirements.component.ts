import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { KycIEOModel } from 'app/ieo/models/ieo-kyc.model';

@Component({
  selector: 'app-ieo-requirements',
  templateUrl: './ieo-requirements.component.html',
  styleUrls: ['./ieo-requirements.component.scss'],
})
export class IEORequirementsComponent implements OnInit {

  @Input('isAuthenticated') public isAuthenticated: boolean = false;
  @Input('requirements') public requirements: KycIEOModel;
  @Output('showPolicy') public showPolicy: EventEmitter<any> = new EventEmitter();
  constructor(

  ) { }

  ngOnInit() { }

  isBoolean(val) {
    return typeof val === 'boolean';
  }

  preventDefault(e) {
    e.preventDefault();
  }

  policyOpen(e) {
    this.preventDefault(e);
    this.showPolicy.emit();
  }

}
