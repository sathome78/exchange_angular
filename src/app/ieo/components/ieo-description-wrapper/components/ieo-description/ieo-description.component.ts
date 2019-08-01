import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-ieo-description',
  templateUrl: './ieo-description.component.html',
  styleUrls: ['./ieo-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IEODescriptionComponent implements OnInit {
  @Input('ieoToken') public ieoToken = null;

  constructor() {}

  ngOnInit() {}
}
