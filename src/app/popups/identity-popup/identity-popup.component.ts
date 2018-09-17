import { Component, OnInit } from '@angular/core';
import {PopupService} from '../../services/popup.service';

@Component({
  selector: 'app-identity-popup',
  templateUrl: './identity-popup.component.html',
  styleUrls: ['./identity-popup.component.scss']
})
export class IdentityPopupComponent implements OnInit {

  constructor(private popupService: PopupService) { }

  ngOnInit() {
  }

}
