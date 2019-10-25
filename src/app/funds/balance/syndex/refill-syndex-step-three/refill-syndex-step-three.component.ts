import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Animations } from 'app/shared/animations';
import { BalanceService } from 'app/funds/services/balance.service';
import { SyndexService } from 'app/funds/services/syndex.service';
import { SyndexOrderInfo } from 'app/funds/models/syndex-order-info.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-refill-syndex-step-three',
  templateUrl: './refill-syndex-step-three.component.html',
  styleUrls: ['./refill-syndex-step-three.component.scss'],
  animations: [Animations.popupOverlayTrigger, Animations.popupModalTrigger],
})
export class RefillSyndexStepThreeComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() showPopup;
  @Input() data;
  public stepTwoName: string;
  public step = 3;
  public orderInfo: SyndexOrderInfo = null;
  public loading = true;

  public statesList = {
    WAITING_CONFIRM: 'waiting_confirm',
    OPEN_DISPUT: 'open_disput',
  };
  public activeState = this.statesList.WAITING_CONFIRM;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.classList.contains('overlay--modal')) {
      this.onCloseRefillBalancePopup();
    }
  }

  constructor(private balanceService: BalanceService, private syndexService: SyndexService)  {}

  ngOnInit() {
    this.loading = true;
    this.syndexService.getSyndexOrderInfo(this.data.orderId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: SyndexOrderInfo) => {
        this.orderInfo = res;
        this.loading = false;
      }, err => {
        this.loading = false;
      });

  }

  setStep(step: number) {
    this.step = step;
  }

  onCloseRefillBalancePopup() {
    this.showPopup = false;
    setTimeout(() => {
      this.balanceService.toggleSyndexRefillPopup$.next({ state: false, data: null });
    }, 1000);
  }

}
