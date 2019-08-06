import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-step-two-qubera',
  templateUrl: 'step-two-qubera.component.html',
  styleUrls: ['step-two-qubera.component.scss'],
})
export class StepTwoQuberaComponent implements OnInit {
  @Output() closeQuberaPopup = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}
}
