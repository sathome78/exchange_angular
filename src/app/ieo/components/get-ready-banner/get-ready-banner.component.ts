import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-get-ready-banner',
  templateUrl: './get-ready-banner.component.html',
  styleUrls: ['./get-ready-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetReadyBannerComponent{

  @Output('onClick') public onClick: EventEmitter<any> = new EventEmitter();
  constructor() { }

}
