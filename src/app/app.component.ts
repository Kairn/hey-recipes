import { Component, OnInit } from '@angular/core';

import { RawData } from './main/main.component';
import { HEY_RECIPE_CAPTURE } from './header/header.component';

import * as rawData from '../assets/data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  rawData!: RawData

  constructor() {
    // Load cookie if present
    let cookieData = localStorage.getItem(HEY_RECIPE_CAPTURE);
    if (cookieData) {
      try {
        this.rawData = JSON.parse(cookieData);
      } catch (error) {
        console.error("Cookie data is corrupt");
        this.rawData = new RawData(rawData);
      }
    } else {
      this.rawData = new RawData(rawData);
    }
  }

  ngOnInit(): void {
    console.log('App launching...');
  }

  updateRawData(rawData: RawData) {
    this.rawData = rawData;
  }
}
