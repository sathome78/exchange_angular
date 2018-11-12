import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {
 /** toggle for limits-dropdown */
 public isDpropdownOpen = false;
 /** dpropdown limit data */
 public limitsData = ['Limit order', 'Stop-limit order'];
 /** selected limit */
 public dropdownLimitValue = this.limitsData[0];
 /** selected percent */
 public percents;
 public userMoney = 3000000000;

  limitForm: FormGroup;
  stopForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.limitForm = new FormGroup({
       quantityOf: new FormControl('', Validators.required ),
       priceIn: new FormControl('', Validators.required ),
       totalIn: new FormControl('', Validators.required ),
    });

    this.stopForm = new FormGroup({
      quantityOf: new FormControl('', Validators.required ),
      stop: new FormControl('', Validators.required ),
      limit: new FormControl('', Validators.required ),

      totalIn: new FormControl('', Validators.required ),
    });
  }

  toggleLimitDropdown() {
    this.isDpropdownOpen = !this.isDpropdownOpen;
  }

  selectedLimit(limit: string) {
    this.dropdownLimitValue = limit;
    this.limitForm.reset();
    this.percents = null;
  }

  selectedPercent(percent: number) {
    this.percents = percent;
    const quantityOf = this.userMoney * this.percents / 100;
    this.dropdownLimitValue === this.limitsData[0] ?
      this.limitForm.controls['quantityOf'].setValue(quantityOf) :
      this.stopForm.controls['quantityOf'].setValue(quantityOf);
  }

  onSubmit() {

  }
}
