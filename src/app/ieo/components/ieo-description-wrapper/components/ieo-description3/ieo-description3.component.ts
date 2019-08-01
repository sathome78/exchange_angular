import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ieo-description3',
  templateUrl: './ieo-description3.component.html',
  styleUrls: ['./ieo-description3.component.scss'],
})
export class IeoDescription3Component implements OnInit {
  @Input('ieoToken') public ieoToken = null;

  constructor() {}

  ngOnInit() {}
}
