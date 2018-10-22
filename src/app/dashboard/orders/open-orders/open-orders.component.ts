import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MockDataService} from '../../../services/mock-data.service';
import {OpenOrders} from '../open-orders.model';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit {

  public openOrders: OpenOrders[];
  @Output() countOpenOrders: EventEmitter<number> = new EventEmitter();

  constructor(
    private mockData: MockDataService
  ) { }

  ngOnInit() {
    this.openOrders = this.mockData.getOpenOrders();
    this.countOpenOrders.emit(this.openOrders.length);
  }

}
