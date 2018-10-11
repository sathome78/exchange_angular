import {Component, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.itemName = 'graph';
  }

}
