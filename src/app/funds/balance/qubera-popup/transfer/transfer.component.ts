import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  @Input() qubera;
  @Input() step;

  constructor() { }

  ngOnInit() {
  }

}
