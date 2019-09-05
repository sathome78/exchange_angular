import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-refill-coin-pay',
  templateUrl: './refill-coin-pay.component.html',
  styleUrls: ['./refill-coin-pay.component.scss'],
})
export class RefillCoinPayComponent implements OnInit {
  @Input() public refillData;
  @Input() public redirectionUrl: string;
  @Input() public selectMerchantName: string;
  @Output() public goToBalances = new EventEmitter<null>();
  @ViewChild('link') link: ElementRef;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.link.nativeElement.click();
    }, 1000);
  }

}
