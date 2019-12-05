import { Injectable } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MainLoaderService {
  public isAuth$;
  public dashboardLoader: Subject<any> = new Subject();

  public const = {
    ordersBookDB: 'ordersBookDB',
    marketsDB: 'marketsDB',
    openOrdersDB: 'openOrdersDB',
    tradesHistoryDB: 'tradesHistoryDB',
    pairInfoDB: 'pairInfoDB',
  };

  // dashboard loaders
  public ordersBookDB: Subject<any> = new Subject();
  public marketsDB: Subject<any> = new Subject();
  public openOrdersDB: Subject<any> = new Subject();
  public tradesHistoryDB: Subject<any> = new Subject();
  public pairInfoDB: Subject<any> = new Subject();

  constructor() {}

  provideLoader(type: string) {
    if (this.const[type]) {
      this[type].next();
    }
  }

  dashboardLoaderFn(isAuth) {
    if (isAuth) {
      this.dashboardWithAuth();
    } else {
      this.dashboardWithoutAuth();
    }
  }

  private dashboardWithoutAuth() {
    forkJoin(
      this.ordersBookDB.pipe(take(1)),
      this.marketsDB.pipe(take(1)),
      this.tradesHistoryDB.pipe(take(1)),
      this.pairInfoDB.pipe(take(1))
    )
      .pipe(take(1))
      .subscribe(() => {
        this.dashboardLoader.next();
      }, err => {
        this.dashboardLoader.next();
      });
  }

  private dashboardWithAuth() {
    forkJoin(
      this.ordersBookDB.pipe(take(1)),
      this.marketsDB.pipe(take(1)),
      this.openOrdersDB.pipe(take(1)),
      this.tradesHistoryDB.pipe(take(1)),
      this.pairInfoDB.pipe(take(1))
    )
      .pipe(take(1))
      .subscribe(() => {
        this.dashboardLoader.next();
      }, err => {
        this.dashboardLoader.next();
      });
  }
}
