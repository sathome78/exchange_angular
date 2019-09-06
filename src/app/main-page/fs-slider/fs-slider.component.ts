import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fs-slider',
  templateUrl: './fs-slider.component.html',
  styleUrls: ['./fs-slider.component.scss']
})
export class FsSliderComponent implements OnInit {
  public slides = [];
  public slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    appendArrows: document.getElementsByClassName('arrows-container')
    // dots: false,
  };
  constructor() { }

  ngOnInit() {
  }

}
