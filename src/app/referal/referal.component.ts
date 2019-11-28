import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as fromCore from '../core/reducers';
import { PopupService } from 'app/shared/services/popup.service';
import { ReferralService } from './referal.service';
import { ReferralLink, RefParams } from './models/referral-link.model';

@Component({
  selector: 'app-referal',
  templateUrl: './referal.component.html',
  styleUrls: ['./referal.component.scss'],
})
export class ReferalComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public isAuthenticated: boolean;
  public Tabs = {
    income: 'income',
    structure: 'structure',
  };
  public tab = this.Tabs.structure;
  public myReferralLinks: ReferralLink[];
  public newStructureName = '';

  constructor(
    private store: Store<fromCore.State>,
    private popupService: PopupService,
    private referralService: ReferralService
  ) { }

  ngOnInit() {
    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;
      });

    this.referralService.getMyReferralLinks()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((links: ReferralLink[]) => {
        this.myReferralLinks = links;
      });

  }

  openRegistration() {
    this.popupService.showMobileRegistrationPopup(true);
  }

  selectTab(tab) {
    this.tab = tab;
  }

  get isMobile(): boolean {
    return window.innerWidth <= 1199;
  }

  createNewStructure() {
    const name = this.newStructureName.trim();
    if (name) {
      this.referralService.createNewReferralLink(name)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          console.log(res)
          this.newStructureName = null;
        });
    }
  }

  changeStructureName(params: RefParams) {
    this.referralService.changeReferralLinkName(params.name, params.link)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const index = this.myReferralLinks.findIndex(l => l.link === params.link);
        if (index >= 0) {
          const item = { ...this.myReferralLinks[index], name: params.name };
          this.myReferralLinks[index] = item;
        }
      });
  }

  openFirstChilds(link: ReferralLink) {
    this.referralService.getFirstChildsReferralLinks(link.link, link.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((childs: ReferralLink[]) => {
        const index = this.myReferralLinks.findIndex(l => l.link === link.link);
        if (index >= 0) {
          const item = { ...this.myReferralLinks[index], childs };
          this.myReferralLinks[index] = item;
        }
      });
  }

  openSecondChilds(params: {mainLink: ReferralLink, child1: ReferralLink}) {
    this.referralService.getChildsReferralLinks(params.child1.level + '', params.child1.userId + '')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((childs: ReferralLink[]) => {
        const mainIndex = this.myReferralLinks.findIndex(l => l.link === params.mainLink.link);
        if (mainIndex >= 0) {
          const childIndex = this.myReferralLinks[mainIndex].childs.findIndex(l => l.userId === params.child1.userId);
          if (childIndex >= 0) {
            this.myReferralLinks[mainIndex].childs[childIndex].childs = childs;
          }
        }
      });
  }

  openThirdChilds(params: {mainLink: ReferralLink, child1: ReferralLink, child2: ReferralLink}) {
    this.referralService.getChildsReferralLinks(params.child2.level + '', params.child2.userId + '')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((childs: ReferralLink[]) => {
        const mainIndex = this.myReferralLinks.findIndex(l => l.link === params.mainLink.link);
        if (mainIndex >= 0) {
          const child1Index = this.myReferralLinks[mainIndex].childs.findIndex(l => l.userId === params.child1.userId);
          if (child1Index >= 0) {
            const child2Index = this.myReferralLinks[mainIndex].childs[child1Index].childs
              .findIndex(l => l.userId === params.child2.userId);
            if (child2Index >= 0) {
              this.myReferralLinks[mainIndex].childs[child1Index].childs[child2Index].childs = childs;
            }
          }
        }
      });
  }

}
