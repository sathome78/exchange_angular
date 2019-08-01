import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ieo-description-wrapper',
  templateUrl: './ieo-description-wrapper.component.html',
  styleUrls: ['./ieo-description-wrapper.component.scss'],
})
export class IeoDescriptionWrapperComponent implements OnInit {
  @Input('IEOId') public IEOId: string;
  @Input('ieoToken') public ieoToken = null;

  constructor() {}

  ngOnInit() {}
}
