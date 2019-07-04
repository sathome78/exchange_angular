import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ieo-description4',
  templateUrl: './ieo-description4.component.html',
  styleUrls: ['./ieo-description4.component.scss']
})
export class IeoDescription4Component implements OnInit {
  @Input('ieoToken') public ieoToken = null;

  constructor() { }

  ngOnInit() {
  }

}
