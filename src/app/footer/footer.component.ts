import { Component, OnInit } from '@angular/core';
import { BreakpointService } from 'app/shared/services/breakpoint.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public breakpointService: BreakpointService,) { }

  ngOnInit() {
  }

}
