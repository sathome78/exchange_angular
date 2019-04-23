import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Animations} from '../../../shared/animations';
import {NewApiKeyItem} from '../../../model/api-key.model';
import {Store} from '@ngrx/store';
import * as fromCore from '../../../core/reducers';
import * as settingsActions from '../../store/actions/settings.actions';

@Component({
  selector: 'app-api-key-created',
  templateUrl: './api-key-created.component.html',
  styleUrls: ['./api-key-created.component.scss'],
  animations: [
    Animations.popupOverlayTrigger, Animations.popupModalTrigger
  ]
})
export class ApiKeyCreatedComponent implements OnInit {

  @Input() showPopup: boolean;
  @Input() newKey: NewApiKeyItem;
  @Output() closeCreatedKeyPopup = new EventEmitter<boolean>();

  constructor(
    private store: Store<fromCore.State>,
  ) { }

  ngOnInit() {
  }

  onCloseCreatedKeyPopup() {
    this.showPopup = false;
    this.store.dispatch(new settingsActions.LoadApiKeysAction());
    setTimeout(() => {
      this.closeCreatedKeyPopup.emit(true);
    }, 1000);
  }
}
