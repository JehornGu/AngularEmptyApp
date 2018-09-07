import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {
  @Input() init: boolean;
  @Output() change = new EventEmitter<boolean>();
  public value: boolean;

  private count = 0;

  constructor() {
    this.init = false;
  }

  ngOnInit() {
    this.value = this.init;
    this.change.emit(this.value);
  }

  toggle(e) {
    e.preventDefault();
    this.value = !this.value;
    this.change.emit(this.value);
  }
}
