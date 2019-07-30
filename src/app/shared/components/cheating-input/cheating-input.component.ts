import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cheating-input',
  templateUrl: './cheating-input.component.html',
  styleUrls: ['./cheating-input.component.scss']
})
export class CheatingInputComponent implements OnInit {

  @Input() public currencyLabel: string;
  @Input() public placeholder: string;
  @Input() public label: string;

  constructor() { }

  ngOnInit() {
  }

}
