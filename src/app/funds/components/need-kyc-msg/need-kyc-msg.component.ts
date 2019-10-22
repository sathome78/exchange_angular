import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-need-kyc-msg',
  templateUrl: './need-kyc-msg.component.html',
  styleUrls: ['./need-kyc-msg.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NeedKycMsgComponent implements OnInit {

  @Input() public type: 'refill' | 'withdraw';
  @Input() public kyc: 'none' | 'shuftipro' | 'ariadnext' | 'shuftipro_and_ariadnext';
  @Input() public currencyName = '';

  constructor(public router: Router) { }

  ngOnInit() {
  }

  get typeOperation() {
    return this.type[0].toUpperCase() + this.type.slice(1);
  }

  goToKYC() {
    if (this.kyc === 'shuftipro') {
      this.router.navigate(['/settings/verification']);
    }
  }

}
