import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { KycIEOModel } from 'app/ieo/models/ieo-kyc.model';

@Component({
  selector: 'app-ieo-requirements',
  templateUrl: './ieo-requirements.component.html',
  styleUrls: ['./ieo-requirements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IEORequirementsComponent implements OnInit {

  @Input('isAuthenticated') public isAuthenticated: boolean = false;
  @Input('requirements') public requirements: KycIEOModel;
  constructor() { }

  ngOnInit() { }

  isBoolean(val) {
    return typeof val === 'boolean';
  }

}
