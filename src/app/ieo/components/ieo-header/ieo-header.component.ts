import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IEOItem } from 'app/model/ieo.model';

@Component({
  selector: 'app-ieo-header',
  templateUrl: './ieo-header.component.html',
  styleUrls: ['./ieo-header.component.scss']
})
export class IeoHeaderComponent implements OnInit {

  @Input() IEOData: IEOItem;
  @Input() userBalanceBTC: number;
  @Output() onBuy: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  get boughtAmount () {
    return this.IEOData.amount - this.IEOData.availableAmount
  }

  get sessionSupply () {
    return this.IEOData.amount * this.IEOData.rate;
  }

  get boughtAmountPer () {
    return (this.boughtAmount / (this.IEOData.amount / 100)).toFixed(2);
  }

}
