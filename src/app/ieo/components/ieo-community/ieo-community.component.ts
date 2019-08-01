import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-ieo-community',
  templateUrl: './ieo-community.component.html',
  styleUrls: ['./ieo-community.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IEOCommunityComponent implements OnInit {
  @Input() public community = null;

  constructor() {}

  ngOnInit() {}

  trackByCommunity(index) {
    return index;
  }
}
