import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { RefParams, ReferralLink } from '../models/referral-link.model';

@Component({
  selector: 'app-structure-table',
  templateUrl: './structure-table.component.html',
  styleUrls: ['./structure-table.component.scss'],
})
export class StructureTableComponent implements OnInit {

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
