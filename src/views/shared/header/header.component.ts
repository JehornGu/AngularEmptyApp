import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {Utils} from '../../../services/utilities.service';
import {NavDataModel} from '../../../models/nav-data.model';
import {Datas} from '../../../models/datas.model';
import {CommonService} from '../../../services/common/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [CommonService]
})
export class HeaderComponent implements OnInit, OnChanges {
  public navData: NavDataModel[];
  public settingDialog = false;
  public isSelect = false;
  private timer = 0;
  private scrollTopTimer;

  @ViewChild('header') headerEl: ElementRef;
  @ViewChild('scrollTop') scrollTopEl: ElementRef;

  @Input() headerStyle: Datas;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.navMenu().subscribe(
      data => {
        this.navData = data;
      }
    );

    this.scrollStyle();
  }

  ngOnChanges() { }

  // ngFor finished
  private forRendered(activeLine, navWrap) {
    this.navigatorActiveLine(activeLine, navWrap);
  }

  // Navigator active line
  private navigatorActiveLine(activeLine, navWrap) {
    const navs = navWrap.children;
    const isActive = /\sactive$/;
    let activeIndex = 0;
    for (let i = 0; i < navs.length; i++) {
      if (isActive.test(navs[i].className)) {
        activeIndex = i;
        break;
      }
    }

    let left = 0;
    for (let i = 0; i < navs.length; i++) {
      if (i < activeIndex) {
        // padding-left
        const styles = Utils.getEleStyle(navs[i]);
        const outerwidth = parseInt(styles.width, 10) + parseInt(styles.paddingLeft, 10) + parseInt(styles.paddingRight, 10);
        left += outerwidth;
      }
    }

    const itemStyle = Utils.getEleStyle(navs[activeIndex]);
    const itemWidth = itemStyle.width,
      itemPadding = itemStyle.paddingLeft;

    activeLine.style.width = itemWidth;
    activeLine.style.transform = `translateX(${left}px)`;
  }

  toggleSetting(isShow: any) {
    const show = !!isShow;
    // clearTimeout(this.timer);
    // if (!show) {
    //   // delay 600ms for hide
    //   this.timer = setTimeout(() => {
    //     this.settingDialog = show;
    //   }, 600);
    //   return;
    // }
    this.settingDialog = show;
  }

  change(select: boolean) {
    this.isSelect = select;
  }

  private scrollStyle() {
    const styles = Utils.getEleStyle(this.headerEl.nativeElement);
    const height = parseInt(styles.height, 10);
    const background = '58, 58, 58';

    Utils.windowScroll((offset, direction) => {
      if (offset.y > height) {
        this.headerEl.nativeElement.style.transform = `translateY(${-height}px)`;
      }
      if (offset.y > 950) {
        this.scrollTopEl.nativeElement.style.display = 'block';
      } else {
        this.scrollTopEl.nativeElement.style.display = 'none';
      }
      switch (direction.y) {
        case 'down':
          if (offset.y > height) {
            this.headerEl.nativeElement.style.transform = `translateY(${-height}px)`;
            this.headerEl.nativeElement.style.background = `rgba(${background}, 0)`;
          }
          break;
        case 'up':
          this.headerEl.nativeElement.style.transform = `translateY(0)`;
          if (offset.y < height) {
            this.headerEl.nativeElement.style.background = '';
            return;
          }
          this.headerEl.nativeElement.style.background = `rgba(${background}, 1)`;
          break;
      }
    });
  }

  public backToTop() {
    let scrollTop = Utils.getScrollTop();
    clearInterval(this.scrollTopTimer);
    this.scrollTopTimer = setInterval(() => {
      scrollTop -= 100;
      window.scrollTo(0, scrollTop);
      if (scrollTop <= 0) {
        clearInterval(this.scrollTopTimer);
      }
    }, 24);
  }

  private setHeaderStyle(): string {
    let bgSrc = 'rgba(244, 216, 217, 0)';
    if (this.headerStyle && this.headerStyle.account === true) {
      bgSrc = 'rgba(244, 216, 217, 0.9)';
    }
    return bgSrc;
  }
}
