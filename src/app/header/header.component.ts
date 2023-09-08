import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RawData, UserData } from '../main/main.component';
import { CookieData } from '../app.component';

export const HEY_RECIPE_CAPTURE = 'hey_recipe_capture';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() rawData!: RawData;
  @Input() userData!: UserData;

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Init
  }

  capture() {
    const cookieData: CookieData = {
      rawData: this.rawData,
      userData: this.userData,
    }
    localStorage.setItem(HEY_RECIPE_CAPTURE, JSON.stringify(cookieData));
    this._snackBar.open('Data captured', '🍕', {
      duration: 4000,
    });
  }
}
