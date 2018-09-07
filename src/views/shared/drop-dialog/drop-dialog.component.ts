import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Datas} from '../../../models/datas.model';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {ANIMATE_STATES} from '../../../models/animate-state.model';

@Component({
  selector: 'app-drop-dialog',
  templateUrl: './drop-dialog.component.html',
  styleUrls: ['./drop-dialog.component.scss'],
  animations: [
    trigger('fade', [
      state(ANIMATE_STATES[0], style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition(`void => *`, [
        animate('300ms ease-in', keyframes([
          style({ opacity: 0, transform: 'scale(0)', offset: 0 }),
          style({ opacity: 1, transform: 'scale(1.1)', offset: 0.6 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1 })
        ]))
      ]),
      transition('* => void', [
        animate('200ms ease-out', keyframes([
          style({ opacity: 1, transform: 'scale(1)', offset: 0 }),
          style({ opacity: 0, transform: 'scale(0)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class DropDialogComponent implements OnInit, OnChanges {
  public arrowStyle: Datas = {};
  public dialogStyle: Datas = {};
  public isShow: boolean;
  public state: string;
  public delayTimer: any;
  private POSITIONS = ['bot', 'bottom', 'top', 'left', 'right'];

  @Input() show: boolean;
  @Input() direction: string;
  @Input() arrow: string;
  @Input() arrowBg: string;
  @Input() borderColor: string;
  @Input() position: string[] = []; // @param [0: left, 1: top]
  @Input() size: string[] = []; // @param [0: width, 1: height]
  @Input() delayIn: number; // ms
  @Input() delayOut: number; // ms

  constructor() {
    this.direction = this.POSITIONS[0]; // default bottom
    this.delayIn = 300; // default fadeIn
    this.delayOut = 300; // default fadeOut
  }

  ngOnInit() {
    let arrowStyle = 'left';
    if (this.direction === this.POSITIONS[3] || this.direction === this.POSITIONS[4]) {
      // left || right
      arrowStyle = 'top';
    }
    this.arrowStyle[arrowStyle] = this.arrow;
    this.arrowStyle['background'] = this.arrowBg;
    this.arrowStyle['border-color'] = this.borderColor;

    this.dialogStyle['border-color'] = this.borderColor;
    this.dialogStyle['left'] = this.position[0];
    this.dialogStyle['top'] = this.position[1];
    this.dialogStyle['width'] = this.size[0];
    this.dialogStyle['height'] = this.size[1];

    this.isShow = this.show;
  }

  ngOnChanges() {
    if (this.show) {
      // 显示
      this.toggle(this.delayIn);
    } else {
      // 关闭
      this.toggle(this.delayOut);
    }
  }

  toggle(delay: number) {
    if (this.delayTimer) {
      window.clearInterval(this.delayTimer);
    }
    this.delayTimer = window.setInterval(() => this.isShow = this.show, delay);
  }
}
