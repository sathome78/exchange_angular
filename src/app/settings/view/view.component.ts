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
          console.log(err);
        });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleLowColorMode() {
    this.isLowColorModeEnabled = !this.isLowColorModeEnabled;
    this.settingsService.updateUserColorDepth(this.isLowColorModeEnabled)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
          console.log(result);
        },
        err => {
          console.log(err);
        });
  }
}
