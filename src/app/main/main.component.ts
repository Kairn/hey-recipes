import { Component, OnInit } from '@angular/core';

import * as data from '../../assets/data.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  data: any = data;

  ngOnInit(): void {
    console.log(this.data['ingredients']);
  }
}
