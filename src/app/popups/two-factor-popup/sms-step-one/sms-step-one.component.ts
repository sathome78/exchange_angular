import { Component, OnInit } from '@angular/core';
import {OnNextStep, PopupService} from '../../../services/popup.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'app-sms-step-one',
  templateUrl: './sms-step-one.component.html',
  styleUrls: ['./sms-step-one.component.scss']
})
export class SmsStepOneComponent implements OnInit, OnNextStep {
  dropDownOpen: boolean;
  region: {country: string, iconPath: string};
  form: FormGroup;
  private phoneRegex = '^\\d+$';

  constructor(private popupService: PopupService) {

  }

  ngOnInit() {
    this.region = this.getRegions().slice()[3];
    this.form = new FormGroup({
      'phone': new FormControl('',
        {validators: [Validators.required, Validators.pattern(this.phoneRegex)], updateOn: 'blur'}),
    });
  }

  onNextStep() {
    this.popupService.moveNextStep();
  }

  openDropdown() {
    this.dropDownOpen = !this.dropDownOpen;
  }

  getRegions(): {country: string, iconPath: string}[] {
    const regions: {country: string, iconPath: string}[] = [];
    regions.push({country: 'Poland', iconPath: '../../../../assets/img/flag-pl.svg'});
    regions.push({country: 'Russia', iconPath: '../../../../assets/img/flag-ru.svg'});
    regions.push({country: 'USA', iconPath: '../../../../assets/img/flag-en.svg'});
    regions.push({country: 'China', iconPath: '../../../../assets/img/flag-cn.svg'});
    return regions;
  }

  onSelect(lRegion: {country: string, iconPath: string}) {
    this.region = lRegion;
  }

}
