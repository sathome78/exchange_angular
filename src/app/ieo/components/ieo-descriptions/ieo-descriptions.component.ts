import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-ieo-descriptions',
  templateUrl: './ieo-descriptions.component.html',
  styleUrls: ['./ieo-descriptions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IEODescriptionsComponent implements OnInit {

  @Input('description') public description = null;
  @Input('ieoToken') public ieoToken = null;

  constructor() { }

  ngOnInit() {
    console.log(this.description);
  }

}
