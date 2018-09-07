import {Component, Input, OnInit} from '@angular/core';
import {Datas} from '../../../models/datas.model';

@Component({
  selector: 'app-theme-btn',
  template: `
    <div class="btn-theme-wrap">
      <a *ngIf="link"
         [routerLink]="link"
         class="btn btn-theme"
         (mouseover)="animate(1)"
         (mouseleave)="animate(0)"
         [ngStyle]="showStyle"
         [target]="target">{{ name }}</a>
      <a *ngIf="!link"
         href="javascript: void(0);"
         class="btn btn-theme"
         (mouseover)="animate(1)"
         (mouseleave)="animate(0)"
         [ngStyle]="showStyle">{{ name }}</a>
    </div>
  `,
  styleUrls: ['./theme-btn.component.scss']
})
export class ThemeBtnComponent implements OnInit {
  @Input() name: string;
  @Input() link: string;
  @Input() bg: string;
  @Input() color: string;
  @Input() target: string;
  public showStyle: Datas;
  private offset: string;

  constructor() {
    this.name = 'BUTTON';
    this.link = '';
    this.offset = '1rem';
    this.showStyle = {};
    this.target = '_blank';
  }

  ngOnInit() {
    this.showStyle.background = this.bg;
    this.showStyle.color = this.color;
  }

  public animate(isF) {
    const isFocus = !!isF;
    if (isFocus) {
      this.showStyle.transform = `translate3d(0, 0, 0)`;
    } else {
      this.showStyle.transform = `translate3d(-${this.offset}, -${this.offset}, 0)`;
    }
  }
}
