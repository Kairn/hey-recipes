import { Component, OnInit } from '@angular/core';

import { RawData, UserData } from './main/main.component';
import { HEY_RECIPE_CAPTURE } from './header/header.component';

import * as rawData from '../assets/data.json';

export interface CookieData {
  rawData: RawData,
  userData: UserData,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  rawData!: RawData
  userData!: UserData

  constructor() {
    // Load cookie if present
    const cookieData = localStorage.getItem(HEY_RECIPE_CAPTURE);
    if (cookieData) {
      try {
        const parsedCookie: CookieData = JSON.parse(cookieData);
        this.rawData = new RawData(parsedCookie.rawData);
        this.userData = new UserData(parsedCookie.userData);
      } catch (error) {
        console.error("Cookie data is corrupt");
        this.rawData = new RawData(rawData);
        this.userData = new UserData(undefined);
      }
    } else {
      this.rawData = new RawData(rawData);
      this.userData = new UserData(undefined);
    }
  }

  ngOnInit(): void {
    console.log('App launching...');
  }

  updateRawData(rawData: RawData) {
    this.rawData = rawData;
  }

  updateUserData(userData: UserData) {
    this.userData = userData;
  }
}
