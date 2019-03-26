import {Component, OnInit, OnDestroy} from '@angular/core';
import {SettingsService} from '../settings.service';
import {UserService} from '../../shared/services/user.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {

  public isLowColorModeEnabled = false;
  public loading: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private settingsService: SettingsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUserColorEnabled()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(enabled => {
          this.isLowColorModeEnabled = enabled;
        },
        err => {
          console.error(err);
        });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleLowColorMode() {
    this.isLowColorModeEnabled = !this.isLowColorModeEnabled;
    this.loading = true;
    this.settingsService.updateUserColorDepth(this.isLowColorModeEnabled)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
          // console.log(result);
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
        });
  }
}
