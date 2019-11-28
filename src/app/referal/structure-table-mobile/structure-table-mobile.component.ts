import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReferralLink, RefParams } from '../models/referral-link.model';

@Component({
  selector: 'app-structure-table-mobile',
  templateUrl: './structure-table-mobile.component.html',
  styleUrls: ['./structure-table-mobile.component.scss'],
})
export class StructureTableMobileComponent implements OnInit {
  @Input() public links;
  @Output() public changeName: EventEmitter<RefParams> = new EventEmitter();
  @Output() public clickMainLink: EventEmitter<ReferralLink> = new EventEmitter();
  @Output() public clickChild1Link: EventEmitter<{mainLink: ReferralLink, child1: ReferralLink}> = new EventEmitter();
  @Output() public clickChild2Link: EventEmitter<{mainLink: ReferralLink, child1: ReferralLink, child2: ReferralLink}>
    = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
