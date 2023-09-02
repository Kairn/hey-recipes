import { Component, OnInit } from '@angular/core';

import * as raw_data from '../../assets/data.json';

export interface Chip {
  readonly id: number;
  readonly name: string;
}

export interface Ingredient {
  readonly id: number;
  readonly quantity: number;
}

export interface Meal {
  readonly id: number;
  readonly name: string;
  readonly picUrl: string;
  readonly desc: string;
  readonly tags: number[];
  readonly ingredients: Ingredient[];
  readonly amount: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private raw_data: any = raw_data;

  all_tags!: Chip[];
  all_ingredients!: Chip[];
  meals!: Meal[];

  filtered_tags!: Chip[];
  filtered_ingredients!: Chip[];

  ngOnInit(): void {
    // TODO: Load data from cookies

    this.all_tags = this.raw_data['tags'];
    this.all_ingredients = this.raw_data['ingredients'];
    this.meals = this.raw_data['meals'];

    this.filtered_tags = [];
    this.filtered_ingredients = [];
  }
}
