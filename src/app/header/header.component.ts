import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RawData } from '../main/main.component';

export const HEY_RECIPE_CAPTURE = 'hey_recipe_capture';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() rawData!: RawData;

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Init
  }

  capture() {
    localStorage.setItem(HEY_RECIPE_CAPTURE, JSON.stringify(this.rawData));
    this._snackBar.open('Data captured', '🍕', {
      duration: 4000,
    });
  }
}
