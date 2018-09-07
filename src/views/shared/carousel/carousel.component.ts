import {Component, ElementRef, Input, OnChanges, ViewChild} from '@angular/core';
import {Datas} from '../../../models/datas.model';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnChanges {
  @Input() banners = [];
  @Input() delay = 3000;
  @Input() duration = 1200;
  @Input() height = '650px';

  public arr = [];
  public contentStyle: Datas = {};
  public itemStyle: Datas = {};
  private counts: number;
  private current = 0;
  private timer = 0;
  private timer2 = 0;
  private autoTimer = 0;
  private changing = false;
  private loaded = 0;
  public preSrc = '/assets/img/shared/loading_60.gif';

  constructor() { }

  ngOnChanges() {
    if (typeof this.banners === 'object' && this.banners.length) {
      this.banners.map(item => item.loaded = false);
      [...this.arr] = this.banners;
      this.counts = this.arr.length;
      this.init();

      this.arr.forEach((item, index) => {
        const self = this;
        const img = new Image();
        img.onload = function () {
          self.loaded++;
          self.banners[this.dataset.index].loaded = true;

          if (self.loaded === self.arr.length) {
            // Banners loaded finished
            self.auto();
          }
        };
        img.src = item.src;
        img.dataset.index = '' + index;
      });
    }
  }

  private init() {
    this.banners.push(this.arr[0]);
    this.banners.unshift(this.arr[this.counts - 1]);
    this.contentStyle.width = (100 * this.banners.length) + '%';
    this.contentStyle.marginLeft = '-100%';
    this.contentStyle.transitionDuration = `${this.duration}ms`;
    this.itemStyle.width = (100 / this.banners.length) + '%';
    this.itemStyle.height = this.height;
  }

  public imgOnLoad(e) {
    // this.loaded++;
    // if (this.loaded === this.banners.length) {
    //   // Banners loaded finished
    //   this.auto();
    // }
  }

  // next
  public next() {
    if (this.checkChanging()) {
      this.current++;

      this.setPosition();
    }
  }

  // prev
  public prev() {
    if (this.checkChanging()) {
      this.current--;

      this.setPosition();
    }
  }

  // pagination
  public go(page: number) {
    if (this.checkChanging()) {
      this.current = page;

      this.setPosition();
    }
  }

  // stop auto
  public stop() {
    clearInterval(this.autoTimer);
  }

  // auto
  public auto() {
    clearInterval(this.autoTimer);
    this.autoTimer = setInterval(() => {
      this.next();
    }, this.delay);
  }

  private setPosition() {
    const left = this.getLeft();
    this.contentStyle.transitionDuration = `${this.duration}ms`;
    this.contentStyle.transform = `translateX(${left}%)`;

    if (this.current < 0) {
      this.current = this.counts - 1;
      this.resetPosition();
    }
    if (this.current > this.counts - 1) {
      this.current = 0;
      this.resetPosition();
    }
  }

  private getLeft(): number {
    const left = -100 / this.banners.length * this.current;
    return left;
  }

  private resetPosition() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const left = this.getLeft();
      this.contentStyle.transitionDuration = `0ms`;
      this.contentStyle.transform = `translateX(${left}%)`;
    }, this.duration);
  }

  private checkChanging() {
    if (this.changing) {
      return false;
    }

    clearInterval(this.autoTimer);
    this.changing = true;
    clearTimeout(this.timer2);
    this.timer2 = setTimeout(() => {
      this.changing = false;
      this.auto();
    }, this.duration);
    return true;
  }

}

