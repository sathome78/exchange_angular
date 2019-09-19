import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'app/shared/services/user.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss'],
})
export class UnsubscribeComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public subscribed = false;
  public loading = false;
  public token;
  public id;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.token = route.snapshot.queryParams['token'];
    this.id = route.snapshot.queryParams['public_id'];
    this.location.replaceState('unsubscribe');
  }

  ngOnInit() {

  }
  resubscribe() {
    this.loading = true;
    this.userService.unsubscribeMail(this.token || null, this.id || null, !this.subscribed)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.subscribed = !this.subscribed;
        this.loading = false;
      }, err => {
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
