import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {Utils} from '../services/utilities.service';

@Directive({
  selector: '[appNavHover]'
})
export class NavHoverDirective {
  constructor(private el: ElementRef) { }

  @Input('appNavHover') index: number;

  @Input() active: HTMLElement;

  @HostListener('mouseover', ['$event']) onMouseEnter(e) {
    this.setActiveLine();
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(e) {
    const index = this.getActived();

    this.setActiveLine(index);
  }

  private setActiveLine(index = this.index) {
    const itemStyle = Utils.getEleStyle(this.el.nativeElement),
      wrapStyle = Utils.getEleStyle(this.el.nativeElement.parentNode);

    const itemWidth = itemStyle.width,
      itemPadding = itemStyle.paddingLeft;
    const one = parseInt(itemWidth, 10) + parseInt(itemPadding, 10) * 2;

    this.active.style.width = itemWidth;
    this.active.style.transform = `translateX(${(one * index)}px)`;
  }

  private getActived(): number {
    const navWrap = this.el.nativeElement.parentNode;
    const navs = navWrap.children;
    const isActive = /\sactive$/;
    let activeIndex = 0;
    for (let i = 0; i < navs.length; i++) {
      if (isActive.test(navs[i].className)) {
        activeIndex = i;
        break;
      }
    }

    return activeIndex;
  }
}
