import { Component, OnInit } from '@angular/core';
import {PopupService} from '../shared/services/popup.service';

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.scss']
})
export class PopupsComponent implements OnInit {

  constructor(
    public popupService: PopupService,
  ) { }

  ngOnInit() {
  }

}
