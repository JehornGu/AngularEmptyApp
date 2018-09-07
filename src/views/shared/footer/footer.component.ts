import {Component, OnInit} from '@angular/core';
import {Utils} from '../../../services/utilities.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public year: number;

  constructor() {
    this.year = new Date().getFullYear();
  }

  ngOnInit() {}
}
