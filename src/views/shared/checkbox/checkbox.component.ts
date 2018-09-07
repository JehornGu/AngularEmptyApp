import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Datas} from '../../../models/datas.model';

@Component({
  selector: 'app-checkbox',
  template: `
    <div class="checkbox pull-left" (click)="toggle($event)" [ngClass]="classes">
      <input type="checkbox" [name]="name" [(ngModel)]="isSelected">
      <span class="inside"><i class="fa fa-check"></i></span>
    </div>
  `
})
export class CheckboxComponent implements OnInit {
  public isSelected = false;
  public classes: Datas = {};

  @Input() init: boolean;
  @Input() style: string;
  @Input() name: string;

  @Output() value = new EventEmitter<boolean>();

  constructor() {
    this.init = false;
    this.style = 'primary';
    this.name = '';
  }

  ngOnInit() {
    this.isSelected = this.init;
    this.classes.active = this.isSelected;
    this.classes[this.style] = true;
  }

  public toggle(e) {
    this.isSelected = !this.isSelected;
    this.classes.active = this.isSelected;
    this.value.emit(this.isSelected);
  }
}
