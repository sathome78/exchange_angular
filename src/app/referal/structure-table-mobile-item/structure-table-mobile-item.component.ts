import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ReferralLink, RefParams } from '../models/referral-link.model';

@Component({
  selector: 'app-structure-table-mobile-item',
  templateUrl: './structure-table-mobile-item.component.html',
  styleUrls: ['./structure-table-mobile-item.component.scss'],
})
export class StructureTableMobileItemComponent implements OnInit, OnChanges {
  @Input() public link: ReferralLink;
  @Output() public changeName: EventEmitter<RefParams> = new EventEmitter();
  @Output() public clickMainLink: EventEmitter<ReferralLink> = new EventEmitter();
  @Output() public clickChild1Link: EventEmitter<{mainLink: ReferralLink, child1: ReferralLink}> = new EventEmitter();
  @Output() public clickChild2Link: EventEmitter<{mainLink: ReferralLink, child1: ReferralLink, child2: ReferralLink}>
    = new EventEmitter();
  public isEdit = false;
  public newName = '';
  public isCopied = false;
  public isOpened = false;
  public isOpened1 = false;
  public isOpened2 = false;
  public isOpened3 = false;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(v) {
    if (v.link && v.link.currentValue !== this.link) {
      this.onCancel(null);
    }
  }

  copyLink(e, val: string) {
    e.stopPropagation();
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
      this.cdr.detectChanges();
    }, 1500);
    const el = document.createElement('textarea');
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.opacity = '0';
    el.value = val;
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  onEdit(e) {
    e.stopPropagation();
    this.newName = this.link.name;
    this.isEdit = true;
  }

  onOpen(e, key) {
    e.stopPropagation();
    this[key] = !this[key];
  }

  onApply(e) {
    e.stopPropagation();
    const val = this.newName.trim();
    if (val && val !== this.link.name) {
      const params = new RefParams(val, this.link.link);
      this.changeName.emit(params);
    }
  }

  onCancel(e) {
    if (e) {
      e.stopPropagation();
    }
    this.isEdit = false;
    this.newName = '';
  }

  onClickMainItem() {
    if (this.link.numberChild > 0) {
      this.clickMainLink.emit(this.link);
    }
  }

  onClickChild1Item(e, child1) {
    e.stopPropagation();
    if (child1.numberChild > 0) {
      const params = {
        child1,
        mainLink: this.link,
      };
      this.clickChild1Link.emit(params);
    }
  }
  onClickChild2Item(e, child1, child2) {
    e.stopPropagation();
    if (child2.numberChild > 0) {
      const params = {
        child1,
        child2,
        mainLink: this.link,

      };
      this.clickChild2Link.emit(params);
    }
  }

  inputSaver(e) {
    e.stopPropagation();
  }

}
