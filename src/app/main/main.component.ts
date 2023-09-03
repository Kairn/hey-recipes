import { Component, OnInit } from '@angular/core';

import { ChipChange, ChipType } from '../chipset/chipset.component';

import * as rawData from '../../assets/data.json';

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
  amount: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private rawData: any = rawData;

  readonly TAG = ChipType.TAG;
  readonly INGREDIENT = ChipType.INGREDIENT;

  allTags!: Chip[];
  allIngredients!: Chip[];
  allMeals!: Meal[];

  filteredTags!: Chip[];
  filteredIngredients!: Chip[];
  filteredMeals!: Meal[];

  leftMeals!: Meal[];
  rightMeals!: Meal[];

  ngOnInit(): void {
    // TODO: Load data from cookies

    this.allTags = this.rawData['tags'];
    this.allIngredients = this.rawData['ingredients'];
    this.allMeals = this.rawData['meals'];

    this.filteredTags = [];
    this.filteredIngredients = [];
    this.filteredMeals = [];

    this._filterMeals();
  }

  processChipChange(change: ChipChange) {
    console.log(change);
  }

  private _filterMeals() {
    this.filteredMeals = this.allMeals.filter(meal => this._isMealDisplay(meal));
    this._distributeMeals();
  }

  private _isMealDisplay(meal: Meal): boolean {
    return true;
  }

  private _distributeMeals() {
    this.leftMeals = [];
    this.rightMeals = [];
    let rightCount = Math.floor(this.filteredMeals.length / 2);
    for (let i = 0; i < this.filteredMeals.length - rightCount; ++i) {
      this.leftMeals.push(this.filteredMeals[i]);
    }
    for (let i = this.filteredMeals.length - rightCount; i < this.filteredMeals.length; ++i) {
      this.rightMeals.push(this.filteredMeals[i]);
    }
  }

  _dbg() {
    console.log(this.filteredIngredients);
    console.log(this.filteredTags);
  }
}
