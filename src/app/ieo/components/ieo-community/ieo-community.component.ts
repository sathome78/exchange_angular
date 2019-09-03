import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IEOItem } from 'app/model/ieo.model';

@Component({
  selector: 'app-ieo-community',
  templateUrl: './ieo-community.component.html',
  styleUrls: ['./ieo-community.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IEOCommunityComponent implements OnInit {
  public _IEOName: string;
  @Input('IEOName')
  get IEOName(): string {
    return this._IEOName;
  }
  set IEOName(value: string) {
    this._IEOName = value;
    this.website = this.selectWebsite(value);
  }
  public website = null;

  constructor() {}

  ngOnInit() {}

  selectWebsite(name) {
    if (!name) {
      return null;
    }
    switch (name) {
      case 'DOM':
        return 'https://debourse.com';
      default:
        return null;
    }
  }

  trackByCommunity(index) {
    return index;
  }
}
