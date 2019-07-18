import { Component, OnInit } from '@angular/core';
import { BalanceService } from 'app/funds/services/balance.service';
import { first } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-refill-step-three',
  templateUrl: './refill-step-three.component.html',
  styleUrls: ['./refill-step-three.component.scss']
})
export class RefillStepThreeComponent implements OnInit {

  form: FormGroup;

  constructor(
    public balanceService: BalanceService
  ) { 

    balanceService.getRefillTransfer()
      .pipe(first())
      .subscribe((data: any) => {
        this.sendRefillBalance = data;
        console.log(this.sendRefillBalance);
      });
  }

  sendRefillBalance: any;

  ngOnInit() {
    this.initForm();
    
  }


  initForm() {
    this.form = new FormGroup({
      code: new FormControl('', Validators.required)
    });
  }

  submit(form) {
    if(form.valid){
      this.sendRefillBalance.securityCode = `${form.value.code}`;

      this.balanceService.withdrawRequest(this.sendRefillBalance)
        .pipe(first())
        .subscribe((data: any) => {
          console.log(data);
        }, error => {
          console.log(error);
        });
    }
  }

}
