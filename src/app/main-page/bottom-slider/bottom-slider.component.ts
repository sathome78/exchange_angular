import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-slider',
  templateUrl: './bottom-slider.component.html',
  styleUrls: ['./bottom-slider.component.scss']
})
export class BottomSliderComponent implements OnInit {
  public slides = [];
  public slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    appendArrows: document.getElementsByClassName('bottom-arrows-container')
  };
  constructor() { }

  ngOnInit() {
  }

}
